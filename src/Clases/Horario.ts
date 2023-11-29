export class DatosReserva{
    IdReserva!:number;
    DiaClases!:number;
    IdAula!:number;
    IdCurso!:number;
    FechaLimite!:string;
    NomCurso!:string;
    NomProfesor!:string;
    Codigo!:string;
    bloque!:Datosbloque[];
}

export class Datosbloque{
    IdBloque!:number[];
}