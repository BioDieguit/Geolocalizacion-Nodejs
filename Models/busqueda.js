const fs = require('fs')
const axios = require('axios');


class Busquedas{
                historial = [];
                dbPath='./db/database.json';
                constructor(){
                    this.leerDB();
                }

////////////////////////////////////////////////////////////////////////////////////////////////////
     get paramsMapbox(){
          return{
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'language':es
                }
                  }
////////////////////////////////////////////////////////////////////////////////////////////////////
     get paramsOPENWEATHER(){
           return{
             'access_token':process.env.OPENWEATHER_KEY,
             'units':'metric',
             'lang':es
          }
            }                  
///////////////////////////////////////////////////////////////////////////////////////////////////                
       async ciudad(lugar=''){
         //peticion http
        try{
            const instance= axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get();
            return resp.data.features.map(lugar=>({// resp.data.features.map(lugar=>({})) con los corechetes dentro del parentesis indicamos que regresamos un objeto de forma implicita
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
           
        }catch(error){
            return [];
           }
        }
////////////////////////////////////////////////////////////////////////////////////////////////////////////        
            async clima (lat,lon) {
                 try{
                     const instance = axios.create({
                        baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                        params: {...this.paramsOPENWEATHER, lat, lon}
                     })
                  
                 const resp= await instance.get(); 
                 const{weather, main} = resp.data;

                 return{
                    desc: weather[0].description,
                    main: main.temp_min,
                    max:main.temp_max,
                    temp: main.temp
                 }
           
                 }catch(error){
                    console.log(error);
                 }
              }  
////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        agregarHistorial(lugar=''){
            if(this.historial.includes(lugar.toLocaleLowerCase)) {
                return
            }
             this.historial=this.historial.splice(0,4); // Para que solo se mantengan 5 registros en el historial
             this.historial.unshift(lugar.toLocaleLowerCase);
             this.guardarDB();
        }
////////////////////////////////////////////////////////////////////////////////////////////////////////////
          guardarDB(){
              const payload= {
                  Registros: this.historial
              }
              fs.writeFileSync(this.dbPath, JSON.stringify(payload))
          
            }
////////////////////////////////////////////////////////////////////////////////////////////////////////////
           leerDB(){
              if (!fs.existsSync(this.dbPath)) return

              const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
              const data = JSON.parse(info);

              this.historial = Registros.historial;
           }
}


module.exports = Busquedas;