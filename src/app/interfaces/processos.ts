export interface Processos {
    id?: string
    codeProcesso?: number   //codigo para compartilhamento
    tribunal?: string       // TJSP(Tribunal de justiça de São Paulo)
    situacao?: string      // primeira ou segunda
    assunto?: string        // ex(Indenização por Dano Moral)
    descricao?: string      // descrição do processo
    userOAB?: string         // Advogado responsável
    userId?: string
    createdAt?: number
}
