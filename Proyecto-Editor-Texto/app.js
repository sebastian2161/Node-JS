const readline = require('readline');
const Messages = require('./messages');
const Document = require('./document');
const Directory = require('./directory');

const dir= new Directory();

let interface = readline.Interface(process.stdin, process.stdout);

const tools =`Comandos: :q = salir, :sa = guardar como, :s = guardar
--------------------------------------`

const pantalla = `
                    =====================================
                    Editor de texto. SNCSOFT-SOLUTIONS\n
                    =====================================
                    Elige una opcion:\n
                    1 Crear nuevo documento
                    2 Abrir documento
                    3 Cerrar editor 
                    4 Eliminar un documento\n>`;



mainScreen();
function mainScreen(){
    process.stdout.write('\x1bc');
    interface.question(pantalla, (res) =>{
        switch(res.trim()){
            case '1':
                createFile();
                break;
                        
            case '2':
                openFileInterface(res);
                break;
                        
            case '3':
                interface.close();
                break;

            case '4':
                openFileInterface(res);
                break;
                        
            default:
                mainScreen();
        } 
    });
}

function readCommands(file){
    interface.on('line', (input)=>{
        switch(input.trim()){
            case ':sa':
                saveAs(file);
            break;
            
            case ':q':
                interface.removeAllListeners('line');
                mainScreen();
            break;

            case ':s':
                save(file);
            break;

            default:
                file.append(input.trim());
        }
    })
}

function createFile(){
    let file = new Document(dir.getPath());
    renderInterface(file);
    readCommands(file);
}

function save(file){
    if(file.hasName()){
        file.save()
        renderInterface(file, `${Messages.fileSaved}\n`);
    }else{
        saveAs(file);
    }
}

function saveAs(file){
    interface.question(Messages.requestFileName, (name) =>{
        if(file.exists(name)){
            console.log(Messages.fileExists);
                interface.question(Messages.replaceFile, (confirm)=>{
                    if(confirm == 'y'){
                        file.saveas(name);
                        renderInterface(file, `${Messages.fileSaved}\n`);
                    }else{
                        renderInterface(file, `${Messages.fileNotSaved}\n`);
                    }
                });
        }else{
            file.saveas(name);
            renderInterface(file, `${Messages.fileSaved}\n`);
        }
    });
}

function openFile(file, name){
    content = file.open(name);
    renderInterface(file);
    readCommands(file);
}

function renderInterface(file, mensaje){
    process.stdout.write('\x1bc');
    (file.getName() == '') ? console.log(`| Untitled |`) : console.log(`| ${file.getName()} |`);
    console.log(tools);
    if(mensaje != null) console.log(mensaje);
    console.log(file.getContent());
}

function openFileInterface(res){
    let file = new Document(dir.getPath());
    dir.getFilesInDir();
    console.log(dir);
    interface.question(Messages.requestFileName, (name) =>{
        if(file.exists(name)){
            if(res!='4'){
                openFile(file, name);
            }
            if(res=='4'){
                interface.question(Messages.fileDelete, (confirm)=>{
                    if(confirm == 'y'){
                        file.delete(name);
                        console.log(`El documento fue eliminado:${name} \n`);
                        setTimeout(() => {
                            interface.removeAllListeners('line'); 
                            mainScreen();
                        },3000);

                    }else{
                        interface.removeAllListeners('line');  
                        mainScreen();
                    }
                });
            }

        }else{
            console.log(Messages.fileNotFound);
            interface.removeAllListeners('line');  
            mainScreen();      
        }
    });
}

