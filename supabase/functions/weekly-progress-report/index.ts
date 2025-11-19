import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssessmentData {
  overall_score: number;
  tier: string;
  primary_goal: string;
  top_gaps: Array<{ category: string; score: number }>;
}

interface CheckInData {
  id: string;
  user_id: string;
  week_date: string;
  weight: number | null;
  notes: string | null;
  description: string | null;
  waist_measurement: number | null;
  created_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('[PROGRESS_REPORT] Starting weekly progress report generation');

    // Get all users who have completed a check-in in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentCheckIns, error: checkInsError } = await supabase
      .from('weekly_checkins')
      .select('*')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (checkInsError) {
      console.error('[PROGRESS_REPORT] Error fetching check-ins:', checkInsError);
      throw checkInsError;
    }

    if (!recentCheckIns || recentCheckIns.length === 0) {
      console.log('[PROGRESS_REPORT] No recent check-ins found');
      return new Response(
        JSON.stringify({ message: 'No recent check-ins to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Group check-ins by user (get latest per user)
    const userCheckIns = new Map<string, CheckInData>();
    for (const checkIn of recentCheckIns) {
      if (!userCheckIns.has(checkIn.user_id)) {
        userCheckIns.set(checkIn.user_id, checkIn);
      }
    }

    console.log(`[PROGRESS_REPORT] Processing ${userCheckIns.size} users`);

    const notifications = [];

    // Process each user
    for (const [userId, latestCheckIn] of userCheckIns) {
      try {
        // Fetch user's assessment baseline
        const { data: assessment } = await supabase
          .from('lead_responses')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!assessment) {
          console.log(`[PROGRESS_REPORT] No assessment found for user ${userId}`);
          continue;
        }

        // Parse assessment data
        let assessmentData: AssessmentData | null = null;
        try {
          assessmentData = JSON.parse(assessment.special_notes || '{}');
        } catch (e) {
          console.error(`[PROGRESS_REPORT] Error parsing assessment for user ${userId}:`, e);
        }

        // Fetch user's first check-in for baseline comparison
        const { data: allCheckIns } = await supabase
          .from('weekly_checkins')
          .select('*')
          .eq('user_id', userId)
          .order('week_date', { ascending: true });

        if (!allCheckIns || allCheckIns.length === 0) {
          continue;
        }

        const firstCheckIn = allCheckIns[0];
        const checkInCount = allCheckIns.length;

        // Generate insights
        const insights = generateInsights(
          assessmentData,
          firstCheckIn,
          latestCheckIn,
          checkInCount
        );

        // Create notification
        const notification = {
          user_id: userId,
          title: '📊 Your Weekly Progress Report',
          message: insights.summary,
          type: 'progress_report',
          action_url: '/progress',
          created_at: new Date().toISOString(),
        };

        notifications.push(notification);

        // Fetch user profile for display name
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', userId)
          .single();

        console.log(`[PROGRESS_REPORT] Generated report for ${profile?.display_name || userId}: ${insights.summary.substring(0, 100)}...`);

      } catch (userError) {
        console.error(`[PROGRESS_REPORT] Error processing user ${userId}:`, userError);
      }
    }

    // Insert all notifications
    if (notifications.length > 0) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notificationError) {
        console.error('[PROGRESS_REPORT] Error creating notifications:', notificationError);
      } else {
        console.log(`[PROGRESS_REPORT] Created ${notifications.length} notifications`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        reports_generated: notifications.length,
        message: `Generated ${notifications.length} progress reports`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('[PROGRESS_REPORT] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function generateInsights(
  assessmentData: AssessmentData | null,
  firstCheckIn: CheckInData,
  latestCheckIn: CheckInData,
  checkInCount: number
): { summary: string; details: string } {
  const insights: string[] = [];
  
  // Week streak
  insights.push(`🎉 You've completed ${checkInCount} check-in${checkInCount > 1 ? 's' : ''}!`);

  // Weight progress
  if (latestCheckIn.weight && firstCheckIn.weight) {
    const weightChange = Number(latestCheckIn.weight) - Number(firstCheckIn.weight);
    if (Math.abs(weightChange) > 0.1) {
      const direction = weightChange > 0 ? 'gained' : 'lost';
      insights.push(`💪 You've ${direction} ${Math.abs(weightChange).toFixed(1)} units since your first check-in.`);
    }
  }

  // Measurement progress
  if (latestCheckIn.waist_measurement && firstCheckIn.waist_measurement) {
    const waistChange = Number(latestCheckIn.waist_measurement) - Number(firstCheckIn.waist_measurement);
    if (waistChange < -0.5) {
      insights.push(`📏 Your waist measurement decreased by ${Math.abs(waistChange).toFixed(1)} units - great progress!`);
    }
  }

  // Focus area progress from latest check-in
  try {
    const latestNotes = JSON.parse(latestCheckIn.notes || '{}');
    if (latestNotes.categoryProgress) {
      const progressEntries = Object.entries(latestNotes.categoryProgress) as Array<[string, number]>;
      const highScores = progressEntries.filter(([_, score]) => score >= 8);
      const lowScores = progressEntries.filter(([_, score]) => score < 5);

      if (highScores.length > 0) {
        const categories = highScores.map(([cat]) => cat).join(', ');
        insights.push(`✨ Excellent progress in: ${categories}!`);
      }

      if (lowScores.length > 0 && assessmentData) {
        const categories = lowScores.map(([cat]) => cat).join(', ');
        insights.push(`🎯 Focus this week on: ${categories}. Remember your goal: ${assessmentData.primary_goal}`);
      }
    }
  } catch (e) {
    console.error('Error parsing check-in notes:', e);
  }

  // Assessment comparison
  if (assessmentData && assessmentData.top_gaps && assessmentData.top_gaps.length > 0) {
    try {
      const latestNotes = JSON.parse(latestCheckIn.notes || '{}');
      if (latestNotes.categoryProgress) {
        const improvements = assessmentData.top_gaps
          .filter(gap => {
            const currentScore = latestNotes.categoryProgress[gap.category];
            return currentScore && currentScore > gap.score;
          })
          .map(gap => gap.category);

        if (improvements.length > 0) {
          insights.push(`🌟 You've improved from your baseline in: ${improvements.join(', ')}!`);
        }
      }
    } catch (e) {
      console.error('Error comparing to assessment:', e);
    }
  }

  // Motivation based on tier
  if (assessmentData?.tier) {
    const tierMotivation = {
      'Thriving': 'Keep up the amazing work!',
      'Steady': 'You\'re building great momentum!',
      'Struggling': 'Every step forward counts - you\'re doing great!',
      'Survival': 'Be proud of showing up for yourself!'
    };
    insights.push(tierMotivation[assessmentData.tier as keyof typeof tierMotivation] || 'Keep going!');
  }

  const summary = insights.join(' ');
  const details = `Check-in #${checkInCount} completed on ${new Date(latestCheckIn.week_date).toLocaleDateString()}`;

  return { summary, details };
}
