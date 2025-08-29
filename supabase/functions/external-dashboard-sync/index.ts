import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface DashboardData {
  users: {
    totalUsers: number;
    activeSubscribers: number;
    premiumUsers: number;
    newUsersThisMonth: number;
  };
  affiliates: {
    totalAffiliates: number;
    pendingApplications: number;
    approvedAffiliates: number;
    rejectedApplications: number;
  };
  engagement: {
    totalCommunityMembers: number;
    weeklyCheckIns: number;
    completedWorkouts: number;
    communityGroups: number;
  };
  content: {
    totalCourses: number;
    totalRecipes: number;
    premiumContent: number;
    freeContent: number;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting external dashboard sync...');

    // Get user statistics
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, created_at');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    // Get subscriber statistics
    const { data: subscribers, error: subscribersError } = await supabase
      .from('subscribers')
      .select('subscribed, subscription_end, created_at');

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      throw subscribersError;
    }

    // Get premium users
    const { data: premiumUsers, error: premiumError } = await supabase
      .from('premium_users')
      .select('is_premium, subscription_end');

    if (premiumError) {
      console.error('Error fetching premium users:', premiumError);
      throw premiumError;
    }

    // Get affiliate statistics
    const { data: affiliates, error: affiliatesError } = await supabase
      .from('affiliate_applications')
      .select('status, created_at');

    if (affiliatesError) {
      console.error('Error fetching affiliates:', affiliatesError);
      throw affiliatesError;
    }

    // Get weekly check-ins count
    const { count: checkInsCount, error: checkInsError } = await supabase
      .from('weekly_checkins')
      .select('*', { count: 'exact', head: true });

    if (checkInsError) {
      console.error('Error fetching check-ins:', checkInsError);
    }

    // Get content completion statistics
    const { count: contentCompletionCount, error: contentError } = await supabase
      .from('user_content_completion')
      .select('*', { count: 'exact', head: true });

    if (contentError) {
      console.error('Error fetching content completions:', contentError);
    }

    // Get courses count
    const { count: coursesCount, error: coursesError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
    }

    // Get course content statistics
    const { data: courseContent, error: courseContentError } = await supabase
      .from('course_content')
      .select('is_premium');

    if (courseContentError) {
      console.error('Error fetching course content:', courseContentError);
    }

    // Calculate metrics
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeSubscribers = subscribers?.filter(s => 
      s.subscribed && (!s.subscription_end || new Date(s.subscription_end) > now)
    ).length || 0;

    const activePremiumUsers = premiumUsers?.filter(p => 
      p.is_premium && (!p.subscription_end || new Date(p.subscription_end) > now)
    ).length || 0;

    const newUsersThisMonth = profiles?.filter(p => 
      new Date(p.created_at) >= thisMonth
    ).length || 0;

    const affiliateStats = {
      totalAffiliates: affiliates?.length || 0,
      pendingApplications: affiliates?.filter(a => a.status === 'pending').length || 0,
      approvedAffiliates: affiliates?.filter(a => a.status === 'approved').length || 0,
      rejectedApplications: affiliates?.filter(a => a.status === 'rejected').length || 0,
    };

    const premiumContentCount = courseContent?.filter(c => c.is_premium).length || 0;
    const freeContentCount = courseContent?.filter(c => !c.is_premium).length || 0;

    const dashboardData: DashboardData = {
      users: {
        totalUsers: profiles?.length || 0,
        activeSubscribers,
        premiumUsers: activePremiumUsers,
        newUsersThisMonth,
      },
      affiliates: affiliateStats,
      engagement: {
        totalCommunityMembers: profiles?.length || 0, // Using total users as community members
        weeklyCheckIns: checkInsCount || 0,
        completedWorkouts: contentCompletionCount || 0,
        communityGroups: 12, // Fixed number based on our community groups
      },
      content: {
        totalCourses: coursesCount || 0,
        totalRecipes: 25, // Based on our recipe data
        premiumContent: premiumContentCount,
        freeContent: freeContentCount,
      },
    };

    console.log('Dashboard data compiled:', dashboardData);

    return new Response(
      JSON.stringify({
        success: true,
        data: dashboardData,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in external dashboard sync:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});