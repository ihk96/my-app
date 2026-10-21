import { useEffect, useState } from "react";
import admin, { AdminInvitationResponseData } from "~/services/admin";
import z from "zod/v4";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useLocation } from "react-router";
import { Panel, RowGroup, SectionTitle } from "../screen";
import { Card, CardContent } from "~/components/ui/card";
import { DrawerPage } from "~/components/ui/drawer-page";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";

export default function AdminInvitations() {
  const location = useLocation();
  const [invitations, setInvitations] = useState<z.infer<typeof AdminInvitationResponseData>[]>([]);
  const [inviteName, setInviteName] = useState(""); 
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    fetchInvitations();
  }, []);

  async function fetchInvitations() {
    const res = await admin.getInvitations();
    setInvitations(res.data);
  }
  

  return (
    <div className="flex flex-col gap-1">
      <SectionTitle
        aside={
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger>
              <Button variant={"outline"} size={"sm"}>초대하기</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>초대하기</DialogTitle>
              </DialogHeader>
              <div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="invite-name">이름</FieldLabel>
                    <Input
                      id="invite-name"
                      type="text"
                      placeholder="예) 김미역"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                    />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button onClick={() => {
                  setIsInviting(true);
                  admin.createInvitation(inviteName)
                    .then(res => {
                      fetchInvitations();
                      setInviteName("");
                      setInviteDialogOpen(false);
                    })
                    .finally(() => setIsInviting(false));
                }} disabled={isInviting}>초대하기</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      >
        초대 내역
      </SectionTitle>
      {invitations.map(invitation => (
        <Card key={invitation.id}>
          <CardContent className="flex flex-col gap-0.5">
              {invitation.is_used ? <Badge className="rounded-sm">사용됨</Badge> : <Badge className="rounded-sm" variant={"outline"}>미사용</Badge>}
              <span>{invitation.name}</span>
              <span className={"text-gray-500"}>id: {invitation.id}</span>
              <span className={"text-gray-500"}>code: {invitation.invitation_code}</span>
              <Button size="sm"
                      onClick={() => {
                        const link = `${window.location.origin}/signup/${invitation.id}`;
                        const text = `${link}\n위 링크로 접속해서 가입해 주세요.\n\n초대 코드: ${invitation.invitation_code}`; 
                        navigator.clipboard.writeText(text);
                      }}
              >초대문 복사</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}