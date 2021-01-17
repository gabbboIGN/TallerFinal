import React, { useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem'
import swal from 'sweetalert';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MaterialTable from 'material-datatable';
import Grid from '@material-ui/core/Grid';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const columns = [
  {
   name: " Libro",
   field: "nombre",
   options: {
    filter: true,
    sort: true,
   }
  },
  
 ,{
    name: "Seleccionar",
    options: {
        headerNoWrap: true,
        customBodyRender: (item, tablemeta, update) => {
            return (
                <div>
                <IconButton
                    variant='outlined'

                    className="btnblock"
                 
                >
                  <DeleteIcon/>
                </IconButton>
                <IconButton
                    variant='outlined'

                    className="btnblock"
              
                >
                  <EditIcon/>
                </IconButton>
                
                </div>
            );
        },
    },
},

 ];



export default function DialogSelect() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = useState([]);
  const [item2, setItem2] = useState([]);
  const [prestamos, setPrestamos] = useState([]);


  useEffect(() => {
      cargar();
      cargarPersona();
      
    }, []);
  
  
  const cargar = async() =>{
      const { data } = await axios.get("http://localhost:9000/api/librotodos");
  
      setItem(data.libro);
      return null;
  }

  const cargarPersona = async() => {
    const { data } = await axios.get("http://localhost:9000/api/personas");

    setItem2(data.persona);
  }
 

    // set value for default selection
    const [selectedValue, setSelectedValue] = useState();
    const [selectedValue2, setSelectedValue2] = useState();

  const handleChange = (event) =>{
      setSelectedValue(event.target.value)
  }
  const handleChange2 = (event) =>{
    setSelectedValue2(event.target.value)
}

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    
  };

  const ingresoPrestamo = (libro,persona) => {
    setOpen(false);


    axios.post("http://localhost:9000/api/prestamo", {
            _id:libro,
            _id:persona
    })
    .then(
      (response)=>{
        console.log(response.data);
        swal({ 
            title: "Datos Guardados",
            text: "Se a realizado el prestamo",
            icon: "success",
            button: "Continuar",
        });
      }
    ).catch((error) => {
      console.log(error);
    })
  }


  return (
    <div>
    <div>
      <Button onClick={handleClickOpen}>Asignar Nuevo Prestamo de Libro</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Seleccionar libro y Alumno</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-dialog-native">Nombre Libro</InputLabel>
              <Select
              value = {selectedValue}
              onChange={handleChange}
              >
                {item.map( items => {
                      return (
                      <MenuItem key={items._id} value={items._id}>{items.titulo}</MenuItem>
                      )
                  })}
              </Select>
              <h1>{selectedValue}</h1>
            </FormControl>
            <FormControl className={classes.formControl}>
             <InputLabel id="demo-dialog-select-label">Libros</InputLabel>
             <Select
              value = {selectedValue2}
              onChange={handleChange2}
              >
                {item2.map( items => {
                      return (
                      <MenuItem key={items._id} value={items._id}>{items.nombre}</MenuItem>
                      )
                  })}
              </Select>
              <h1>{selectedValue2}</h1>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={()=> ingresoPrestamo(selectedValue,selectedValue2)} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    <div className={classes.root}>
        <h1>Prestamos de la biblioteca</h1>
      <Grid container spacing={3}>
        <Grid item xs={6}>
        <MaterialTable
        title="En Curso"
        columns={columns}
        data={prestamos}
        editable={{
            onRowAdd: (newData) =>
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                    setItem((prevState) => {
                    const data = [...prevState.data];
                    data.push(newData);
                    return { ...prevState, data };
                });
                }, 600);
            }),
            onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
                setTimeout(() => {
                resolve();
                if (oldData) {
                    setItem((prevState) => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                    });
                }
                }, 600);
            }),
            onRowDelete: (oldData) =>
            new Promise((resolve) => {
                setTimeout(() => {
                resolve();
                setItem((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                });
                }, 600);
            }),
        }}
        />
       
        </Grid>
        </Grid>
    </div> 
    </div>
  );
}