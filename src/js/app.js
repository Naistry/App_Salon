let pagina = 1;
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
  iniciarApp();
  
});

function iniciarApp(){
    mostrarServicios();


    // Resalta el div actual segun el tab que se presiona
    mostrarSeccion();
    // Oculta o muestra la seccion el tab que se presiona
    cambiarSeccion();
    //paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //compureba la pagina actiaul para ocultar o mostrar el boton de paginacion
    botonesPaginador();


    // Muestra el resumen de la cita o mensaje de error de no validar
    mostrarResumen();

    //almacena el nombre en el objeto 
    nombreCita();

    //almacena la fecha en el objeto
    fechaCita();

    //deshibilita dias pasados
    deshabilitarFecha();

    //almacena la hora de la cita en el objeto

    horaCita();
}

function mostrarSeccion(){
    // quitar la seccion anterior para poder mostrar la nueva
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior ){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    

  
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');
//quitar la clase "actual" del tab anterior
    const tabAnterior =  document.querySelector('.tabs button.actual');
      
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }
    


    // Resaltar tab actual


    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');

}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace=>{
   enlace.addEventListener('click', e =>{
    e.preventDefault();
    pagina = parseInt(e.target.dataset.paso);


   
    mostrarSeccion();
    botonesPaginador();
   });
    });
}

async function mostrarServicios(){
    try {
        const resultado = await fetch('./servicios.json');
        const DB = await resultado.json();
        const {servicios} = DB; //concepto de destruction

        servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio;

            //DOM Scripting
            //Generar nombre del servicio con JS
            const nombreServicio= document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');



            //Generar precio del servicio con JS

            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar Div contenedor de los parrafos anteriores
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;


            //Selecciona un servicio para la cita

            servicioDiv.onclick = seleccionarServicio;

            //Inyectar precio y nombre al div servicio
            
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectar el div de servicios a HTML 
            document.querySelector('#servicios').appendChild(servicioDiv);
        });
        
    } catch (error) {
        console.log(error);
    }
}


function seleccionarServicio(e){

    let elemento;   
    //Forzar el elemento a cual  le damos click sea el Div

    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;
        
    }else {
        elemento= e.target;
    }
    if (elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
        const id=parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');
        const servicioObj = {
            id:parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio :  elemento.firstElementChild.nextElementSibling.textContent
        }
        //console.log(servicioObj);
        agregarServicio(servicioObj);
    }
    
}
function eliminarServicio(id){
   const { servicios} = cita;
   cita.servicios = servicios.filter(servicio => servicio.id !== id);
   
 
}
function agregarServicio(servicioObj){
    const {servicios} = cita;
    cita.servicios = [...servicios, servicioObj];
    
}


function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', ()=>{
        pagina ++;
   //compureba la pagina actiaul para ocultar o mostrar el boton de paginacion
    botonesPaginador();
    
    })
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', ()=>{
        pagina --;
  //compureba la pagina actiaul para ocultar o mostrar el boton de paginacion
    botonesPaginador();
    
    })
}


function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if (pagina ===2){
        
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(pagina ===3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen();//estmaos en la pagina 3, carga el resumen de la cita
        
    }

    mostrarSeccion();
}

function mostrarResumen(){
    //Destructuring
    const {nombre,fecha,hora, servicios} = cita;

    //seleccionar resumen
    const resumenDiv= document.querySelector('.contenido-resumen');

    //limpia el HTML previo
    while( resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }
    //Validacion de objeto

    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');
        
        //Agregar a resumenDiv 
        resumenDiv.appendChild(noServicios);

        return;
    }

    //mostrar info del cliente
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita' ;
    

    //mostrar resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML= `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML= `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML= `<span>Hora:</span> ${hora}`;


    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad= 0;
    //iterar el listado de servicios que elegimos
    servicios.forEach(servicio =>{
        const {nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');
        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');
        const valor = precio.split('$');

         cantidad += parseInt(valor[1].trim());

        
        //colacar texto y precio al div

       contenedorServicio.appendChild(textoServicio);
       contenedorServicio.appendChild(precioServicio);
       serviciosCita.appendChild(contenedorServicio);
      
    });
    console.log(cantidad);
    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML= `<span>Total a Pagar: </span> $${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
    
}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');
     
    nombreInput.addEventListener('input', e=>{
        const nombreTexto = e.target.value.trim();
      


        //validacion de que nombreTexto contiene nombre
         if (nombreTexto === ''|| nombreTexto.length <3){
             mostrarAlerta('Nombre no válido', 'error');
         }else{
             const alerta = document.querySelector('.alerta')
             if(alerta){
                 alerta.remove();
             }
             cita.nombre = nombreTexto;

          
         }
    })
}

function mostrarAlerta (mensaje, tipo ){
 
    //si hay una alerta previa no hay otra
     const alertaPrevia = document.querySelector('.alerta');
     if(alertaPrevia){
         return;
     }

 const alerta = document.createElement('DIV');
 alerta.textContent = mensaje;

 alerta.classList.add('alerta');

 if ( tipo ==='error'){
     alerta.classList.add('error');
 }



 // insertar en el html 

 const formulario = document.querySelector('.formulario');
 formulario.appendChild(alerta);

 // Eliminar la alerta luego de 3 segundos

 setTimeout(() => {
     alerta.remove();
 }, 3000);

}

function fechaCita(){
  const fechaInput = document.querySelector('#fecha');
  fechaInput.addEventListener('input', e =>{
     const dia = new Date (e.target.value).getUTCDay(); //retorna los dias del 0 al 6 siendo 0 el domingo
     
     if ( [0,6].includes(dia)){
         e.preventDefault();
         fechaInput.value = '';
        mostrarAlerta('Día no válido', 'error');
     }else{
         cita.fecha= fechaInput.value;
     }

     console.log(cita);
  })
}

function deshabilitarFecha(){
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth()+1;
    const dia = fechaAhora.getDay()+2;

    let fechaDeshabilitar = '' ;
    // formato deseado  AAAA-MM-DD
    if(mes <10 && dia <10 ){
    fechaDeshabilitar = `${year}-0${mes}-0${dia}`;
    }else if(mes>9 &&dia <10){
        fechaDeshabilitar= `${year}-${mes}-0${dia}`;
    }else if(mes<10 &&dia >9){
        fechaDeshabilitar= `${year}-0${mes}-${dia}`;
    }
    else{
     fechaDeshabilitar = `${year}-${mes}-${dia}`; 
    }
 
    inputFecha.min = fechaDeshabilitar;
}

function horaCita(){
    const inputHora = document.querySelector('#hora');
     inputHora.addEventListener('input',e =>{
         
         const horaCita = e.target.value;
         const hora = horaCita.split(':');

         if (hora[0]<10 || hora[0]>18){
            mostrarAlerta ('Hora no valida', 'error' );
            setTimeout(() => {
            inputHora.value= '';
            }, 3000);
            
         }else{
             cita.hora = horaCita;
         }
        
     })
}