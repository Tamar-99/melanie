var firebaseConfig = {
    apiKey: "AIzaSyAfFvPg-yd3PBT2jyV_yO8YO21mqY624Ng",
    authDomain: "proyecto-99b5e.firebaseapp.com",
    databaseURL: "https://proyecto-99b5e.firebaseio.com",
    projectId: "proyecto-99b5e",
    storageBucket: "proyecto-99b5e.appspot.com",
    messagingSenderId: "219681985194",
    appId: "1:219681985194:web:9ed4f0be9c32ee44b536d3",
    measurementId: "G-Z4X8S4FY59"
  };

  var app = {

    inicio : function(){
        this.iniciaFastClick();
        this.iniciaFirebase();
        this.observadorFirebase();
        
    },

    iniciaFastClick: function(){
        FastClick.attach(document.body);
    },
 
    iniciaFirebase : function(){
        var proy = firebase.initializeApp(firebaseConfig);
        firebase.analytics();
    },  

    registroFirebase : function(){
        var email=document.getElementById('email').value;
        var pass=document.getElementById('pass').value;
    
        firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(function(){
            alert("Registrado :"+ email );
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
    },

    observadorFirebase : function(){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              var displayName = user.displayName;
              var email = user.email;
              var emailVerified = user.emailVerified;
              var photoURL = user.photoURL;
              var isAnonymous = user.isAnonymous;
              var uid = user.uid;
              var providerData = user.providerData;
              document.getElementById("log").innerHTML="Logeado : "+user.email;
              document.getElementById("Lemail").className="hide";  
              document.getElementById("Lpass").className="hide";  
              document.getElementById("Blogin").className="hide"; 
            } else {
                document.getElementById("log").innerHTML="No logeado"
                document.getElementById("Lemail").className="";  
                document.getElementById("Lpass").className="";  
                document.getElementById("Blogin").className=""; 
            }
          });
          
    },

    logeandoFirebase : function(){
        var Lemail=document.getElementById('Lemail').value;
        var Lpass=document.getElementById('Lpass').value;

        firebase.auth().signInWithEmailAndPassword(Lemail, Lpass).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(error.message);
          });
    },

    deslogearFirebase : function(){
            firebase.auth().signOut()
            .then(function(){
              console.log('Salir');
            })
            .catch(function(error){
              console.log(error);
            })
    },

    agregaBasedeDatos : function(){
        var db = firebase.firestore(); 

        db.collection("Alumnos").add({
            id : document.getElementById("id").value,
            Nombre : document.getElementById("nombre").value,
            Clase : document.getElementById("clase").value,
            Semestre : document.getElementById("semestre").value,
            Calificacion : document.getElementById("calificacion").value,
            Aula : new firebase.firestore.GeoPoint(parseFloat(document.getElementById("lat").value), parseFloat(document.getElementById("long").value))
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            alert(error);
        });
        
        
    },

    leerBasedeDatos : function(){
        var db = firebase.firestore();

        db.collection("Alumnos").where("Nombre", "==", document.getElementById("nombre").value)
        .get()
        .then(function(querySnapshot) {
            
            querySnapshot.forEach(function(doc) {
                document.getElementById("id").value = doc.data().id;
                document.getElementById("nombre").value = doc.data().Nombre;
                document.getElementById("semestre").value = doc.data().Semestre;
                document.getElementById("clase").value = doc.data().Clase;
                document.getElementById("calificacion").value = doc.data().Calificacion;
                document.getElementById("lat").value = doc.data().Aula.latitude;
                document.getElementById("long").value = doc.data().Aula.longitude;
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    },

    borrarBasedeDatos: function(){
        var db = firebase.firestore();

        db.collection("Alumnos").where("Nombre", "==", document.getElementById("nombre").value)
        .get()
            .then(function(querySnapshot) {
            
                querySnapshot.forEach(function(doc) {
               
                doc.ref.delete()
                .then(() => {
                    console.log("Document successfully deleted!");
                  }).catch(function(error) {
                    console.error("Error removing document: ", error);
                  });
                });
              })
              .catch(function(error) {
                console.log("Error getting documents: ", error);
              });
    },

    actualizaBasedeDatos : function(){
        var db = firebase.firestore();
        
        db.collection("Alumnos").where("Nombre", "==", document.getElementById("nombre").value)
        .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    doc.ref.update({
                        id : document.getElementById("id").value,
                        Nombre : document.getElementById("nombre").value,
                        Clase : document.getElementById("clase").value,
                        Semestre : document.getElementById("semestre").value,
                        Calificacion : document.getElementById("calificacion").value,
                        Aula : new firebase.firestore.GeoPoint(parseFloat(document.getElementById("lat").value), parseFloat(document.getElementById("long").value)) 
                         
                        

                    });
                })   
            })     
        
    },
  
    dispositivoListo: function(){
        navigator.geolocation.getCurrentPosition(app.pintaCoordenadas, app.errorAlSolicitarLocalizacion);
      
    },
 
    pintaCoordenadas: function(position){
        var Mapa = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
        L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVzdXNkZWx0b3JvciIsImEiOiJjanhhbmxmbXcwMm9zM3hwZGFlcG5mM2ZwIn0.8bGV51PvN4q5zroithEkow",{
        atribution: 'mapbox', 
        maxZomm: 18
        }).addTo(Mapa);

        var db = firebase.firestore();
  

        db.collection("Alumnos").where("Clase", "==", "Comercio Electronico ")
        .get()
            .then(function(querySnapshot) {
            
                querySnapshot.forEach(function(doc) {
                    var circle = L.circle([doc.data().Aula.latitude, doc.data().Aula.longitude], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: 5
                    }).addTo(Mapa);
                    circle.bindPopup("Comercio Electronico");
                doc.ref.get()
                .then(() => {
                    console.log("Encontro el Geopoint");
                  }).catch(function(error) {
                    console.error("Error removing document: ", error);
                  });
                });
              })
              
              
        app.pintaMarcador([position.coords.latitude, position.coords.longitude], 'Estoy aqui', Mapa);
        

 
        Mapa.on('click', function(evento){
            var texto = 'Marcador en l(' + evento.latlng.lat.toFixed(2) + ') y L(' + evento.latlng.lng.toFixed(2) +')';
            app.pintaMarcador(evento.latlng, texto, Mapa);
        });
    },
 
    pintaMarcador: function(latlng, texto, mapa){
        var marcador = L.marker(latlng).addTo(mapa);
        marcador.bindPopup(texto).openPopup();
    },
 
    errorAlSolicitarLocalizacion: function(){
        console.log(error.code + ': ' + error.message);
    },
 
 
  
 
 
}
//Menu------------------------------------------------
function Registro(){
    document.getElementById("menu").className='hide';
    document.getElementById("registro").className='';
};

function Login(){
    document.getElementById("menu").className='hide';
    document.getElementById("login").className='';
};
//----------------------------------------------------
//Registro--------------------------------------------
function enviar(){
    app.registroFirebase();
};
function Cerrar(){
    document.getElementById("menu").className='';
    document.getElementById("registro").className='hide';
}
//--------------------------------------------------------
//Login---------------------------------------------------
function acceso(){
    app.logeandoFirebase();  
}
function cerrar(){
    app.deslogearFirebase();
    document.getElementById("login").className="hide";
    document.getElementById("menu").className="";
}
function guardar(){
    app.agregaBasedeDatos();
}
function buscar(){
    app.leerBasedeDatos();
}
function borrar(){
    app.borrarBasedeDatos();
}
function actualizar(){
    app.actualizaBasedeDatos();
}
function limpiar(){
    document.getElementById("id").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("semestre").value = "";
    document.getElementById("clase").value = "";
    document.getElementById("calificacion").value = "";
    document.getElementById("lat").value = "";
    document.getElementById("long").value = "";
    
}

//---------------------------------------------------------

if('addEventListener' in document){
    document.addEventListener('DOMContentLoaded', function(){
    app.inicio();
    app.dispositivoListo();
}, false);

}

