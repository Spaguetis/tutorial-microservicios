#importamos tkinter para la interfaz y time para la hora actual
import tkinter as tk
import time

#ahora voy a crear una funcion para que actualice e reloj cada segundo
def actualizar_reloj():
    hora_actual = time.strftime("%H:%M:%S") #formato 24h
    Label.config(text=hora_actual)  #cambiamos el texto al valor actual
    window.after(1000,actualizar_reloj) # se actualiza cada 1000ms (1s)

#ventana principal
window = tk.Tk()
window.title("Reloj Digital")
window.resizable(False,False)


# establecemos dimensiones
window.geometry("250x100")
window.configure(bg="black")  # fondo negro

#establecemos confuig de los textos etc
Label =tk.Label(
    window,
    font = ("DS-Digital",40) ,  #fuente 
    fg = "lime",           #color de la fuente estulo digial
    bg = "black"           #fondo negro
)
Label.pack(expand=True) #empaquetamos la etiqueta para que se expanda y centre

#llamamos a la funcion de actualizar el reloj
actualizar_reloj()

# mantenemos ventana abierta
window.mainloop()
