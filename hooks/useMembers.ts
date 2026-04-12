import { queryKeys } from "@/hooks/useApi";
import { createCrudHooks } from "@/hooks/useCrudEntity";
import * as memberService from "@/services/members";
import { ListMembersParams } from "@/services/members";
import { CreateMemberPayload, UpdateMemberPayload, Member } from "@/types/entities";

const memberCrudHooks = createCrudHooks<Member, CreateMemberPayload, UpdateMemberPayload, ListMembersParams>({
    queryKeys: queryKeys.members,
    service: {
        list: memberService.getMembers,
        detail: memberService.getMemberById,
        create: memberService.createMember,
        update: memberService.updateMember,
        remove: memberService.deleteMember,
    },
});

export const useMembers = memberCrudHooks.useList;
export const useMember = memberCrudHooks.useDetail;
export const useCreateMember = memberCrudHooks.useCreate;
export const useUpdateMember = memberCrudHooks.useUpdate;
export const useDeleteMember = memberCrudHooks.useDelete;
