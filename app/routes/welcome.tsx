import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export default function Welcome() {

  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="#" className="flex items-center gap-2 self-center font-medium">
					<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<img src="/icons/192.png"/>
					</div>
					Miyaku Org.
				</a>
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">가입에 성공했습니다!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground text-center">입력하신 정보로 회원가입이 완료되었습니다.</p>
              <p className="text-muted-foreground text-center ">이제 로그인을 통해 서비스를 이용하실 수 있습니다.</p>
              <Button className="w-full" onClick={()=>{navigate("/login")}}>로그인</Button>
            </CardContent>
          </Card>
        </div>
			</div>
		</div>
  );
}