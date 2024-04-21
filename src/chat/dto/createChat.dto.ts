import { User } from 'schemas/user.schema'

export class CreateChatDTO {
  content: string

  imgs_url: [string]

  from: User

  to: User
}
