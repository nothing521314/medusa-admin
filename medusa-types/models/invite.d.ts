import { SoftDeletableEntity } from "../interfaces/soft-deletable-entity";
import { UserRoles } from "./user";
export declare class Invite extends SoftDeletableEntity {
    user_email: string;
    role: UserRoles;
    accepted: boolean;
    token: string;
    expires_at: Date;
    metadata: Record<string, unknown>;
    private beforeInsert;
}
/**
 * @schema invite
 * title: "Invite"
 * description: "Represents an invite"
 * x-resourceId: invite
 * required:
 *   - user_email
 * properties:
 *   id:
 *     type: string
 *     description: The invite's ID
 *     example: invite_01G8TKE4XYCTHSCK2GDEP47RE1
 *   user_email:
 *     type: string
 *     description: The email of the user being invited.
 *     format: email
 *   role:
 *     type: string
 *     description: The user's role.
 *     enum:
 *       - admin
 *       - member
 *       - developer
 *     default: member
 *   accepted:
 *     type: boolean
 *     description: Whether the invite was accepted or not.
 *     example: false
 *   token:
 *     type: string
 *     description: The token used to accept the invite.
 *   expores_at:
 *     type: string
 *     description: The date the invite expires at.
 *     format: date-time
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
