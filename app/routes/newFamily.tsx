import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { redirect, useLocation, useNavigate } from "react-router";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "~/components/ui/carousel";
import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/newFamily";
import users from "~/services/users";
import families, { FamilyJoinRequestsResponseData } from "~/services/families";
import type { z } from "zod/v4";
import type { AxiosError } from "axios";
import { Checkbox } from "~/components/ui/checkbox";
import { Field, FieldLabel } from "~/components/ui/field";

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const user = await users.me()
    .then(res=>res.data);

  if(!user){
    return redirect("/login");
  }

  const userFamilies = await families.getMyFamilies()
    .then(res => res.data);

  if(userFamilies && userFamilies.length > 0){
    return redirect("/app");
  }

  return {
    user,
    userFamilies
  }
}
export default function NewFamily() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [ready, setIsReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const hash = location.hash;
  const isExisting = hash === "#existing";
  const isNew = hash === "#new";
  const isHistory = hash === "#history";

  useEffect(() => {
    if(hash) {
      if(carouselApi){
        if(ready){
          if(carouselApi.canScrollNext()){
            carouselApi.scrollTo(1);
          }
        }
      }
    } else {
      if(carouselApi){
        setIsReady(false);
        carouselApi.scrollTo(0);
      }
    }
  }, [carouselApi,hash, ready]); 

  useEffect(() => {
    if(carouselApi){
      carouselApi.on("slidesChanged", (e)=>{
        setIsReady(true);
      });
    }
  }, [carouselApi]);


  return (
    <div className="fixed top-0 h-screen w-screen bg-black">

      <div className="flex h-full flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <img src="/icons/192.png"/>
            </div>
            Miyaku Org.
          </a>
          <div className={cn("flex flex-col gap-6")}>
            <Carousel opts={{watchDrag: false}} setApi={setCarouselApi}>
              <CarouselContent className="h-100">
                <CarouselItem>
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">가족에 가입하기</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div>
                        <p className="text-muted-foreground text-center">가족에 가입하거나 새 가족을 만드실 수 있습니다.</p>
                        <p className="text-muted-foreground text-center">원하는 옵션을 선택해주세요.</p>
                      </div>
                      <Button className="w-full" onClick={() => navigate("#existing")}>기존 가족에 가입하기</Button>
                      <Button variant="outline" className="w-full" onClick={() => navigate("#new")}>새 가족 만들기</Button>

                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground">이미 가입 요청한 내역이 있나요?</p>
                        <Button variant="ghost" onClick={() => navigate("#history")}>내역 보기</Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" className="text-destructive" onClick={() => navigate("#logout")}>로그아웃</Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
                {isExisting && (<>
                  <CarouselItem>
                    <JoinRequest api={carouselApi} />
                  </CarouselItem>
                  <CarouselItem>
                    <Card>
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl">가입 요청 완료</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <div>
                          <p className="text-muted-foreground text-center">가입 요청이 완료되었습니다.</p>
                          <p className="text-muted-foreground text-center">가족 관리자가 확인하여 가입 여부를 결정합니다.</p>
                          <p className="text-muted-foreground text-center">가입이 승인될 때까지 기다려주세요.</p>
                        </div>
                        <Button className="w-full" onClick={()=>{navigate("#history")}}>요청 내역 보기</Button>
                        <Button variant="ghost" className="w-full" onClick={()=>{navigate("#");}}>처음으로</Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                  <CarouselItem>
                    <JoinRequestHistory api={carouselApi} />
                  </CarouselItem>
                </>)}
                {isNew && (<>
                  <CreateFamily api={carouselApi}/>
                  <CarouselItem>
                    <Card>
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl">새 가족 만들기 완료</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <div>
                          <p className="text-muted-foreground text-center">새 가족 만들기가 완료되었습니다.</p>
                          <p className="text-muted-foreground text-center">이제 생성하신 가족의 일원으로 활동하실 수 있습니다.</p>
                        </div>
                        <Button className="w-full" onClick={()=>{navigate("/app")}}>시작하기</Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                </>)}
                {isHistory && (
                  <CarouselItem>
                    <JoinRequestHistory api={carouselApi} />
                  </CarouselItem>
                )}
              </CarouselContent>
            </Carousel>
            
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateFamily({api}: {api: CarouselApi}) {
  const [familyName, setFamilyName] = useState("");
  const [familyNameError, setFamilyNameError] = useState("");
  const [error, setError] = useState("");
  const [features, setFeatures] = useState({
    householdAccountBook: false,
    inventoryManagement: false,
    petManagement: false,
  });
  const navigate = useNavigate();

  function handleCreateFamily() {
    setError("");
    setFamilyNameError("");
    if(familyName.trim() === "") {
      setFamilyNameError("가족 이름을 입력해주세요.");
      return;
    }
    families.createFamily({
      family_name: familyName,
      feature_account_book: features.householdAccountBook,
      feature_inventory: features.inventoryManagement,
      feature_pets: features.petManagement
    }).then(()=>{
      api?.scrollTo(3);
    }).catch((error: AxiosError)=>{
      setError("가족 생성에 실패했습니다.");
    });
  }

  function handleNext(){
    setFamilyNameError("");
    setError("");
    if(familyName.trim() === "") {
      setFamilyNameError("가족 이름을 입력해주세요.");
      return;
    }
    api?.scrollTo(2);
  }

  return (<>
    <CarouselItem>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">새 가족 만들기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="text-muted-foreground text-center">새 가족을 만들기 위해선 가족 이름이 필요합니다.</p>
            <p className="text-muted-foreground text-center">원하는 가족 이름을 입력해주세요.</p>
          </div>
          <Input placeholder="가족 이름 입력" className="w-full" value={familyName} onChange={(e)=>{setFamilyName(e.target.value); setFamilyNameError("");}} />
          {familyNameError && <p className="text-red-500 text-center">{familyNameError}</p>}
          <Button className="w-full" onClick={handleNext}>다음</Button>
          <Button variant="ghost" className="w-full" onClick={()=>{navigate("#");}}>뒤로가기</Button>
        </CardContent>
      </Card>
    </CarouselItem>
    <CarouselItem>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">새 가족 만들기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="text-muted-foreground text-center">새 가족에 활성화 할 기능을 선택해주세요.</p>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <Field orientation="horizontal" className="w-20">
              <Checkbox
                id="household-account-book-checkbox"
                name="household-account-book-checkbox"
                checked={features.householdAccountBook}
                onCheckedChange={(e)=>setFeatures({...features, householdAccountBook: e})}
              />
              <FieldLabel htmlFor="household-account-book-checkbox">
                가계부
              </FieldLabel>
            </Field>
            <Field orientation="horizontal" className="w-20">
              <Checkbox
                id="inventory-management-checkbox"
                name="inventory-management-checkbox"
                checked={features.inventoryManagement}
                onCheckedChange={(e)=>setFeatures({...features, inventoryManagement: e})}
              />
              <FieldLabel htmlFor="inventory-management-checkbox">
                재고관리
              </FieldLabel>
            </Field>
            <Field orientation="horizontal" className="w-20">
              <Checkbox
                id="pet-management-checkbox"
                name="pet-management-checkbox"
                checked={features.petManagement}
                onCheckedChange={(e)=>setFeatures({...features, petManagement: e})}
              />
              <FieldLabel htmlFor="pet-management-checkbox">
                반려동물
              </FieldLabel>
            </Field>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button className="w-full" onClick={handleCreateFamily}>가족 만들기</Button>
          <Button variant="ghost" className="w-full" onClick={()=>{api?.scrollTo(1);}}>뒤로가기</Button>
        </CardContent>
      </Card>
    </CarouselItem>
  </>
  );
}

function JoinRequest({api}: {api: CarouselApi}) {
  const [invitationCode, setInvitationCode] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  
  function handleJoinRequest() {
    setError("");
    families.requestToJoinFamily(invitationCode)
      .then(res => {
        api?.scrollTo(2);
      })
      .catch((err: AxiosError) => {
        if(err.status === 400) {
          setError("잘못된 초대 코드입니다.");
        } else {
          setError("가입 요청에 실패했습니다.");
        }
      });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">가입 요청</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="text-muted-foreground text-center">기존 가족에 가입하기 위해선 초대 코드가 필요합니다.</p>
          <p className="text-muted-foreground text-center">전달 받은 초대 코드를 입력해주세요.</p>
        </div>
        <Input placeholder="초대 코드 입력" className="w-full" value={invitationCode} onChange={(e) => setInvitationCode(e.target.value)} />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Button className="w-full" onClick={handleJoinRequest}>가입 요청하기</Button>
        <Button variant="ghost" className="w-full" onClick={()=>{navigate("#");}}>뒤로가기</Button>
      </CardContent>
    </Card>
  );
}

function JoinRequestHistory({api}: {api: CarouselApi}) {
  const navigate = useNavigate();
  const [joinRequests, setJoinRequests] = useState<z.infer<typeof FamilyJoinRequestsResponseData>[]>([]);
  useEffect(() => {
    families.getMyFamilyJoinRequests()
      .then(res => {
        const pendingRequests = res.data.filter(req => req.is_handled === false);
        setJoinRequests(pendingRequests);
      });
  }, []);
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">가입 요청 내역</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          {joinRequests.length === 0 && (
            <p className="text-muted-foreground text-center">현재 처리 대기 중인 가입 요청이 없습니다.</p>
          )}

          {joinRequests.map(req => (
            <p key={req.id} className="text-muted-foreground text-center">
              {req.family_name} 가족에 가입 요청을 보냈습니다.
            </p>
          ))}
        </div>
        <Button variant="ghost" className="w-full" onClick={()=>{navigate("#");}}>뒤로가기</Button>
      </CardContent>
    </Card>
  );
}