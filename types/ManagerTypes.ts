export interface GestorClassProps {
  id: string;
  name: string;
  prof: string;
  startingDate: Date;
  minuteLength: number;
  vagas: number;
  inscritos: number;
}

export interface GestorPagProps {
  id: string;
  name: string;
  vencimento: Date;
}

