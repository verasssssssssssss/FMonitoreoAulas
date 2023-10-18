export class DatosReserva{
    IdReserva!:number;
    DiaClases!:number;
    IdAula!:number;
    IdCurso!:number;
    FechaLimite!:string;
    NomCurso!:string;
    NomProfesor!:string;
    nBloques!:Datosbloque[]
}

export class Datosbloque{
    Idbloque!:number;
}