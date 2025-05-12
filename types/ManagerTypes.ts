export interface GestorClassProps {
  id: string;
  name: string;
  description: string;
  prof: string;
  startingDate: Date;
  minuteLength: number;
  vagas: number;
  inscritos: number;
  sala: string;
  status: string;
}

export interface GestorPagProps {
  id: string;
  name: string;
  vencimento: Date;
  avatar: string; // <- Adicione esta linha se não existir
}
