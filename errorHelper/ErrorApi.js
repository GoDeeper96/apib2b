export const MapError = (error)=>{
    let errorMensaje = {
        estado:'Error',
        mensaje:'Error desconocido',
        error:'Error desconocido'
    }
    
    if(typeof error==='object')
    {
        const attr = Object.keys(error).filter(x=>x.includes(['errorResponse']))
        if(attr.length!==0)
        {
            const mensaje = error[attr]
            console.log(mensaje.errmsg)
            if(mensaje.errmsg.includes('duplicate'))
            {
                errorMensaje.error='duplicacion'
                errorMensaje.mensaje='Error de duplicacion'
            }
          
        }
        
    }

    return errorMensaje
}