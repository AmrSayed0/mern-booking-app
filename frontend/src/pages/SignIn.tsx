import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/useAppContext";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Welcome Back", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form
      className="w-full max-w-sm p-8 mx-auto rounded shadow-lg bg-gradient-to-b"
      onSubmit={onSubmit}
    >
      <h2 className="text-3xl font-bold mb-3">Sign In</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal mb-3"
          {...register("email", { required: "This field is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm mt-4">
          Not Registered?{" "}
          <Link
            className="hover:underline font-semibold text-blue-500"
            to="/register"
          >
            Create an account
          </Link>
        </span>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg mt-4"
        >
          Login
        </button>
      </span>
    </form>
  );
};

export default SignIn;
