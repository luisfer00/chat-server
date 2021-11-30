export interface messageType {
  user: userType
  text: string
}

export interface userType {
  name: string
  id: string
  typing: boolean
}