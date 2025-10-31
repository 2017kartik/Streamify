import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, //We stop the regular checking the api endpoint for authentication best practices here.
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

export default useAuthUser;
