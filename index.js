require ('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./Models/busqueda");

const main = async() =>{

    const busquedas = new Busquedas();
    let opt;

    do{
        opt= await inquirerMenu();

        switch (opt){

            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                //Buscar los lugares con Axios
                const lugares = await busquedas.ciudad(termino);
                //Menu interactivo con los lugares encontrados
                const id = await listarLugares(lugares);
                if(id==='0') continue;

                 
                const lugarSel= lugares.find(l=>l.id===id);
                
                busquedas.agregarHistorial(lugarSel.nombre);

                const clima= await busquedas.clima(lugarSel.lat, lugarSel.lng);
                
                console.clear(); 
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre );
                console.log('Lat: ', lugarSel.lat);
                console.log('Lng: ', lugarSel.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Como esta el clima: ', clima.desc);
                break;
            case 2:
                busquedas.historial.forEach((lugar, id)=>{
                    const idx = `${id+1}.`.green;
                    console.log(`${idx}-. ${lugar}`)
                })
                break;
                     }
            
        await pausa();         

    } while (opt!=0);
  
}

main();

