declare module 'bcryptjs' {
  export function hash(data: string | Buffer, saltOrRounds: string | number, callback?: (err: Error, encrypted: string) => void): Promise<string>
  export function compare(data: string | Buffer, encrypted: string, callback?: (err: Error, isMatch: boolean) => void): Promise<boolean>
  export function genSalt(rounds?: number, callback?: (err: Error, salt: string) => void): Promise<string>
  export function getRounds(encrypted_password: string): number
}