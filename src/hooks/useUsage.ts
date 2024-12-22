import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUsage() {
  return useQuery({
    queryKey: ['usage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (error) throw error;
      return data || { dream_interpretations_count: 0, image_generations_count: 0 };
    },
  });
}