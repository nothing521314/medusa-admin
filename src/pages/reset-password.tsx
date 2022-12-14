import { navigate } from "gatsby";
import qs from "qs";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { decodeToken } from "react-jwt";
import { useAdminResetPassword } from "../../medusa-react";
import Button from "../components/fundamentals/button";
import MedusaIcon from "../components/fundamentals/icons/medusa-icon";
import SigninInput from "../components/molecules/input-signin";
import SEO from "../components/seo";
import LoginLayout from "../components/templates/login-layout";
import { getErrorMessage } from "../utils/error-messages";

type formValues = {
  password: string;
  repeat_password: string;
};

const ResetPasswordPage = ({ location }) => {
  const parsed = qs.parse(location.search.substring(1));

  let token: { email: string } | null = null;
  if (parsed?.token) {
    try {
      token = decodeToken(parsed.token as string);
    } catch (e) {
      token = null;
    }
  }

  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const email = (token?.email || parsed?.email || "") as string;

  const { register, handleSubmit, formState } = useForm<formValues>({
    defaultValues: {
      password: "",
      repeat_password: "",
    },
  });
  const reset = useAdminResetPassword();

  const handleAcceptInvite = useCallback(
    (data: formValues) => {
      setPasswordMismatch(false);
      setError(null);

      if (data.password !== data.repeat_password) {
        setPasswordMismatch(true);
        return;
      }

      reset.mutate(
        {
          token: parsed.token as string,
          password: data.password,
          email: email,
        },
        {
          onSuccess: () => {
            navigate("/login");
          },
          onError: (err) => {
            setError(getErrorMessage(err));
          },
        }
      );
    },
    [email, parsed.token, reset]
  );

  useEffect(() => {
    if (
      formState.dirtyFields.password &&
      formState.dirtyFields.repeat_password
    ) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [formState]);

  const renderBody = useCallback(() => {
    if (token) {
      return (
        <form
          onSubmit={handleSubmit(handleAcceptInvite)}
          className="flex flex-col items-center"
        >
          <span className="inter-2xlarge-semibold mt-4 text-grey-90">
            Reset your password
          </span>
          <span className="inter-base-regular text-grey-50 mt-2 mb-xlarge">
            Choose a new password below ????????
          </span>
          <SigninInput
            placeholder="Email"
            name="first_name"
            value={email}
            readOnly
          />
          <SigninInput
            placeholder="Password"
            type={"password"}
            {...register("password", { required: true })}
            autoComplete="new-password"
          />
          <SigninInput
            placeholder="Confirm password"
            type={"password"}
            {...register("repeat_password", { required: true })}
            autoComplete="new-password"
            className="mb-0"
          />
          {error && (
            <span className="text-rose-50 w-full mt-xsmall inter-small-regular">
              The two passwords are not the same
            </span>
          )}
          {passwordMismatch && (
            <span className="text-rose-50 w-full mt-xsmall inter-small-regular">
              The two passwords are not the same
            </span>
          )}
          <Button
            variant="primary"
            size="large"
            type="submit"
            className="w-full mt-base rounded-rounded"
            loading={formState.isSubmitting}
            disabled={!ready}
          >
            Reset Password
          </Button>
        </form>
      );
    }

    return (
      <div className="h-full flex flex-col gap-y-2 text-center items-center justify-center w-[320px]">
        <span className="inter-large-semibold text-grey-90">
          You reset link is invalid
        </span>
        <span className="inter-base-regular text-grey-50 mt-2">
          Please try resetting your password again
        </span>
      </div>
    );
  }, [
    email,
    error,
    formState.isSubmitting,
    handleAcceptInvite,
    handleSubmit,
    passwordMismatch,
    ready,
    register,
    token,
  ]);

  return (
    <LoginLayout>
      <SEO title="Reset Password" />
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex min-h-[540px] bg-grey-0 rounded-rounded justify-center">
          <div className="flex flex-col py-12 w-full px-[120px] items-center">
            <div className="min-h-[48px]">
              <MedusaIcon />
            </div>
            {renderBody()}
          </div>
        </div>
      </div>
    </LoginLayout>
  );
};

export default ResetPasswordPage;
