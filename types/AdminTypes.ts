export type GestorStatus = "ativo" | "convidado";
export interface GestorItemProps {
    id: string;
    name: string;
    email: string;
    birthdate: string;
    registration: string;
    status: GestorStatus;
}
