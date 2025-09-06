-- Fix approval history reference issue
-- Create a trigger to update approval_history with the correct press_release_id
CREATE OR REPLACE FUNCTION public.update_approval_history_press_release_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Update any approval history records that have this post_checkout_info_id but wrong press_release_id
  UPDATE public.approval_history 
  SET press_release_id = NEW.id
  WHERE press_release_id = NEW.post_checkout_info_id 
    AND created_at >= NEW.created_at - INTERVAL '1 minute';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for press releases
DROP TRIGGER IF EXISTS update_approval_history_trigger ON press_releases;
CREATE TRIGGER update_approval_history_trigger
  AFTER INSERT ON public.press_releases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_approval_history_press_release_id();