# Importamos la librería tkinter, que permite crear interfaces gráficas
import tkinter as tk

# Esta función se llama cada vez que el usuario hace clic en un botón numérico o de operación
def click_boton(valor):
    # Inserta el valor del botón presionado al final de lo que ya hay en la entrada
    entrada.insert(tk.END, valor)

# Esta función borra todo el contenido actual del campo de entrada
def borrar():
    entrada.delete(0, tk.END)

# Esta función evalúa la operación matemática ingresada
def calcular():
    try:
        # Evalúa la expresión matemática (por ejemplo: "2+3*4")
        resultado = eval(entrada.get())
        # Limpia la entrada
        entrada.delete(0, tk.END)
        # Muestra el resultado en la misma entrada
        entrada.insert(0, str(resultado))
    except:
        # Si ocurre un error (como división por cero), muestra "Error"
        entrada.delete(0, tk.END)
        entrada.insert(0, "Error")

# Creamos la ventana principal de la aplicación
ventana = tk.Tk()
ventana.title("Calculadora")  # Título de la ventana

# Creamos el campo de entrada donde se mostrarán los números y operaciones
entrada = tk.Entry(
    ventana,                # Ventana donde se coloca
    width=20,               # Ancho en caracteres
    font=("Arial", 18),     # Tipo y tamaño de fuente
    borderwidth=5,          # Grosor del borde
    relief="ridge",         # Estilo del borde
    justify="right"         # Alinea el texto a la derecha
)
# Colocamos la entrada en la ventana (fila 0, abarca 4 columnas)
entrada.grid(row=0, column=0, columnspan=4, padx=10, pady=10)

# Creamos una lista con los botones en el orden en que deben aparecer
botones = [
    ('7', '8', '9', '/'),
    ('4', '5', '6', '*'),
    ('1', '2', '3', '-'),
    ('0', '.', '=', '+'),
]

# Recorremos la lista y colocamos cada botón en la interfaz
for i, fila in enumerate(botones):        # i = número de fila
    for j, texto in enumerate(fila):      # j = número de columna
        if texto == '=':
            # Si el botón es "=", lo vinculamos a la función calcular
            boton = tk.Button(
                ventana,
                text=texto,
                width=5,
                height=2,
                font=("Arial", 16),
                command=calcular
            )
        else:
            # Para los demás botones, usamos una función anónima (lambda)
            # para pasar el valor correcto a click_boton()
            boton = tk.Button(
                ventana,
                text=texto,
                width=5,
                height=2,
                font=("Arial", 16),
                command=lambda t=texto: click_boton(t)
            )
        # Colocamos el botón en la cuadrícula
        boton.grid(row=i+1, column=j, padx=5, pady=5)

# Creamos un botón para borrar todo (Clear o "C")
boton_borrar = tk.Button(
    ventana,
    text="C",
    width=22,                  # Ocupa varias columnas
    height=2,
    font=("Arial", 16),
    command=borrar             # Llama a la función borrar
)
# Lo colocamos debajo de todos los botones, ocupando las 4 columnas
boton_borrar.grid(row=5, column=0, columnspan=4, padx=5, pady=5)

# Esta línea mantiene la ventana abierta esperando interacción del usuario
ventana.mainloop()
