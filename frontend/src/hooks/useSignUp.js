import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api.js";
const useSignUp = () => {
  const queryClient = useQueryClient();

  const {
    isPending,
    mutate: signupMutation,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
  
  return { isPending, signupMutation, error };
};

export default useSignUp;
