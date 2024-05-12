import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Account created successfully", type: "SUCCESS" });
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
      <h2 className="text-3xl font-bold mb-3">Create an Account</h2>
      <div>
        <label className="text-sm font-semibold">
          Name
          <input
            type="text"
            placeholder="First and Last Name"
            {...register("name", { required: "Name is required" })}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-2"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </label>
      </div>
      <div>
        <label className="text-sm font-semibold">Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-2"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>
      <div>
        <label className="text-sm font-semibold">Password</label>
        <input
          type="password"
          placeholder="At least 6 characters"
          {...register("password", { required: "Password is required" })}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-2"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>
      <div>
        <label className="text-sm font-semibold">
          Confirm Password
          <input
            type="password"
            {...register("confirmPassword", {
              validate: (value) => {
                if (!value) {
                  return "Confirm Password is required";
                } else if (value !== watch("password")) {
                  return "Passwords do not match";
                }
              },
            })}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-2"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>
      </div>
      <span className="flex items-center justify-between">
        <span className="text-sm mt-4">
          Already have an account? {""}
          <Link
            to="/sign-in"
            className="hover:underline font-semibold text-blue-500"
          >
            Sign In
          </Link>
        </span>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg mt-4"
        >
          Register
        </button>
      </span>
    </form>
  );
};

export default Register;
