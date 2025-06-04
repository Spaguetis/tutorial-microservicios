import psycopg2
import tkinter as tk
from tkinter import messagebox

# --- Conexión a PostgreSQL ---
def conectar_db():
    return psycopg2.connect(
        host="TU_HOST",           # Ej: 'localhost'
        port="TU_PUERTO",         # Ej: '5432'
        user="TU_USUARIO",        # Ej: 'postgres'
        password="TU_CONTRASEÑA", # Ej: '1234'
        database="TU_BASE_DATOS"  # Ej: 'infraestructura_electrica'
    )

# --- Lógica de inserción igual que el script anterior ---
def registrar_poste():
    ubicacion = entry_ubicacion.get()
    cantidad_transformadores = entry_transformadores.get()
    cantidad_cables = entry_cables.get()
    altura_poste = entry_altura.get()
    estado_poste = entry_estado.get()
    observaciones = text_observaciones.get("1.0", tk.END).strip()

    try:
        conn = conectar_db()
        cursor = conn.cursor()
        query = """
            INSERT INTO postes 
            (ubicacion, cantidad_transformadores, cantidad_cables, altura_poste, estado_poste, observaciones)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        valores = (
            ubicacion,
            int(cantidad_transformadores),
            int(cantidad_cables),
            float(altura_poste),
            estado_poste,
            observaciones
        )
        cursor.execute(query, valores)
        conn.commit()
        print("✅ Datos del poste registrados correctamente.")
        messagebox.showinfo("Registro exitoso", "✅ Poste registrado correctamente.")
        limpiar_formulario()
    except Exception as err:
        print("❌ Error al registrar los datos:", err)
        messagebox.showerror("Error", f"Ocurrió un error: {err}")
    finally:
        if conn:
            cursor.close()
            conn.close()

# --- Función para reiniciar la interfaz ---
def limpiar_formulario():
    entry_ubicacion.delete(0, tk.END)
    entry_transformadores.delete(0, tk.END)
    entry_cables.delete(0, tk.END)
    entry_altura.delete(0, tk.END)
    entry_estado.delete(0, tk.END)
    text_observaciones.delete("1.0", tk.END)

# --- Interfaz Gráfica ---
root = tk.Tk()
root.title("Ingreso de datos del poste")

# Campos iguales que el script en consola
tk.Label(root, text="Ubicación:").grid(row=0, column=0, sticky="e")
entry_ubicacion = tk.Entry(root, width=50)
entry_ubicacion.grid(row=0, column=1)

tk.Label(root, text="Cantidad de transformadores:").grid(row=1, column=0, sticky="e")
entry_transformadores = tk.Entry(root)
entry_transformadores.grid(row=1, column=1)

tk.Label(root, text="Cantidad de cables:").grid(row=2, column=0, sticky="e")
entry_cables = tk.Entry(root)
entry_cables.grid(row=2, column=1)

tk.Label(root, text="Altura del poste (m):").grid(row=3, column=0, sticky="e")
entry_altura = tk.Entry(root)
entry_altura.grid(row=3, column=1)

tk.Label(root, text="Estado del poste:").grid(row=4, column=0, sticky="e")
entry_estado = tk.Entry(root)
entry_estado.grid(row=4, column=1)

tk.Label(root, text="Observaciones:").grid(row=5, column=0, sticky="ne")
text_observaciones = tk.Text(root, width=38, height=4)
text_observaciones.grid(row=5, column=1)

btn_registrar = tk.Button(root, text="Registrar Poste", command=registrar_poste)
btn_registrar.grid(row=6, column=0, columnspan=2, pady=10)

root.mainloop()

 