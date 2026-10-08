import type { AxiosError } from "axios";
import { useState } from "react";
import { useLoaderData, useNavigate, type ClientLoaderFunctionArgs } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { toast } from "~/components/ui/toast";
import { cn } from "~/lib/utils";
import login from "~/services/login";
import users, { UserInvitationResponseData } from "~/services/users";
import type { Route } from "./+types/signup.$id";
import type { z } from "zod/v4";

export async function clientLoader({params}: Route.ClientLoaderArgs) {
  if(!params.id) {
    throw new Error("Invitation ID is required");
  }
  const invitation = await users.getInvitation(params.id)
    .then(res => res.data)
    .catch((e: AxiosError)=>{
      throw new Error("잘못된 요청입니다.");
    });

  return {
    invitation
  }
}

export default function Signup({loaderData}: Route.ComponentProps) {
  const { invitation } = loaderData;

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="#" className="flex items-center gap-2 self-center font-medium">
					<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<img src="/icons/192.png"/>
					</div>
					Miyaku Org.
				</a>
				<SignupForm invitation={invitation} />
			</div>
		</div>
	)
}



export function SignupForm({
  invitation,
}: { invitation: z.infer<typeof UserInvitationResponseData> }) {
	const navigate = useNavigate();
  const [invitationCode, setInvitationCode] = useState("");
  const [invitationCodeError, setInvitationCodeError] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginIdError, setLoginIdError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupPending, setSignupPending] = useState(false);

	function handleActionLogin() {
    setSignupPending(true);
    setLoginIdError("");
    setPasswordError("");
    setSignupError("");

    if(!loginId){
      setLoginIdError("Email을 입력해주세요.");
    }
    if(!password){
      setPasswordError("Password를 입력해주세요.");
    }

    if(loginId && password){
      users.signupWithInvitation(invitation.id, {
        invitation_code: invitationCode,
        login_id: loginId,
        password: password,
        name: invitation.name
      }).then(()=>{
        navigate("/");
      }).catch((e: AxiosError)=>{
        if(e.status == 401) {
          setSignupError("입력하신 정보가 일치하지 않습니다.");
        } else {
          setSignupError("로그인 과정에서 문제가 발생했습니다.");
        }
      }).finally(()=>{
        setSignupPending(false);
      });
    } else {
      setSignupPending(false);
    }
	}


	return (
		<div className={cn("flex flex-col gap-6")}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome</CardTitle>
					<CardDescription>
            {invitation.name}님 반갑습니다!<br/>
            초대코드와 함께 회원가입을 진행해주세요.
          </CardDescription>
				</CardHeader>
				<CardContent>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">초대코드</FieldLabel>
								<Input
									id="invitation_code"
									type="text"
									placeholder="초대코드 입력"
                  disabled={loginPending}
									required
                  value={invitationCode}
                  aria-invalid={invitationCodeError != ""}
                  onChange={(e)=>{setInvitationCode(e.currentTarget.value)}}
								/>
                <FieldError>{invitationCodeError}</FieldError>
							</Field>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
                  disabled={loginPending}
									required
                  value={loginId}
                  aria-invalid={loginIdError != ""}
                  onChange={(e)=>{setLoginId(e.currentTarget.value)}}
								/>
                <FieldError>{loginIdError}</FieldError>
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Password</FieldLabel>
								</div>
								<Input 
                  id="password" 
                  type="password" 
                  disabled={loginPending}
                  required 
                  value={password}
                  aria-invalid={passwordError != ""}
                  onChange={(e)=>{setPassword(e.currentTarget.value)}}
                />
                <FieldError>{passwordError}</FieldError>
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password_confirm">Password Confirm</FieldLabel>
								</div>
								<Input 
                  id="password_confirm" 
                  type="password" 
                  disabled={loginPending}
                  required 
                  value={passwordConfirm}
                  aria-invalid={passwordConfirmError != ""}
                  onChange={(e)=>{setPasswordConfirm(e.currentTarget.value)}}
                />
                <FieldError>{passwordConfirmError}</FieldError>
							</Field>
							<Field>
								<Button 
                  type="button" 
                  disabled={loginPending}
                  onClick={handleActionLogin}
                >
                  {loginPending && <Spinner />}
                  LOG IN
                </Button>
								<FieldDescription className="text-center">
								</FieldDescription>
							</Field>
						</FieldGroup>
				</CardContent>
			</Card>
		</div>
	)
}
