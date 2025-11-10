-- Create admin functions for blog management

-- Function to get all blogs with pagination and search
CREATE OR REPLACE FUNCTION public.get_all_blogs(
  search_query text DEFAULT NULL,
  page_number integer DEFAULT 1,
  page_size integer DEFAULT 10
)
RETURNS TABLE(
  id uuid,
  title text,
  content text,
  slug text,
  status text,
  author text,
  excerpt text,
  featured_image_url text,
  tags text[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  published_at timestamp with time zone,
  total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  offset_count integer;
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  offset_count := (page_number - 1) * page_size;

  RETURN QUERY
  WITH filtered_blogs AS (
    SELECT 
      b.id,
      b.title,
      b.content,
      b.slug,
      b.status,
      b.author,
      b.excerpt,
      b.featured_image_url,
      b.tags,
      b.created_at,
      b.updated_at,
      b.published_at
    FROM public.blogs b
    WHERE 
      search_query IS NULL 
      OR b.title ILIKE '%' || search_query || '%'
      OR b.content ILIKE '%' || search_query || '%'
      OR b.excerpt ILIKE '%' || search_query || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(b.tags) tag 
        WHERE tag ILIKE '%' || search_query || '%'
      )
  ),
  total AS (
    SELECT count(*) as count FROM filtered_blogs
  )
  SELECT 
    fb.*,
    t.count as total_count
  FROM filtered_blogs fb
  CROSS JOIN total t
  ORDER BY fb.created_at DESC
  LIMIT page_size
  OFFSET offset_count;
END;
$function$;

-- Function to update a blog post
CREATE OR REPLACE FUNCTION public.admin_update_blog(
  blog_id uuid,
  blog_title text,
  blog_content text,
  blog_slug text,
  blog_status text,
  blog_author text,
  blog_excerpt text,
  blog_featured_image_url text,
  blog_tags text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  UPDATE public.blogs
  SET 
    title = blog_title,
    content = blog_content,
    slug = blog_slug,
    status = blog_status,
    author = blog_author,
    excerpt = blog_excerpt,
    featured_image_url = blog_featured_image_url,
    tags = blog_tags,
    updated_at = now(),
    published_at = CASE 
      WHEN blog_status = 'published' AND published_at IS NULL THEN now()
      ELSE published_at
    END
  WHERE id = blog_id;
END;
$function$;

-- Function to delete a blog post
CREATE OR REPLACE FUNCTION public.admin_delete_blog(blog_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  DELETE FROM public.blogs WHERE id = blog_id;
END;
$function$;