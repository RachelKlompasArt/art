import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import shutil
import os
import json
import re

# ==========================================
# FIX BLURRY UI (High DPI Awareness)
# ==========================================
try:
    from ctypes import windll
    windll.shcore.SetProcessDpiAwareness(1)
except Exception:
    pass

# --- DIRECTORIES & FILES ---
PAINTINGS_DIR = './Paintings'
DESIGN_DIR = './Design'
GALLERY_JSON = 'gallery_data.json'
DESIGN_JSON = 'design_data.json'

os.makedirs(PAINTINGS_DIR, exist_ok=True)
os.makedirs(DESIGN_DIR, exist_ok=True)

# --- CORE DATA UTILITIES ---
def load_json(filepath, default_state):
    if not os.path.exists(filepath):
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(default_state, f)
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return default_state

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

def copy_files(filepaths, target_folder):
    paths = []
    for path in filepaths:
        if path:
            filename = os.path.basename(path)
            dest = os.path.join(target_folder, filename)
            shutil.copy(path, dest)
            paths.append(f"./{os.path.basename(target_folder)}/{filename}")
    return paths

# --- DROPDOWN REFRESH LOGIC ---
def get_gallery_titles():
    return [item['title'] for item in load_json(GALLERY_JSON, [])]

def get_design_titles():
    return [val.get('title', k) for k, val in load_json(DESIGN_JSON, {}).items()]

def refresh_dropdowns():
    combo_g_title['values'] = get_gallery_titles()
    combo_d_title['values'] = get_design_titles()
    update_delete_dropdown()

def update_delete_dropdown(*args):
    if del_category.get() == "Gallery":
        combo_del_title['values'] = get_gallery_titles()
    else:
        combo_del_title['values'] = get_design_titles()
    combo_del_title.set('')

# ==========================================
# TAB 1: GALLERY LOGIC (Add/Update)
# ==========================================
def manage_gallery():
    title = combo_g_title.get().strip()
    if not title:
        messagebox.showerror("Error", "Title is required!")
        return

    data = load_json(GALLERY_JSON, [])
    existing_item = next((item for item in data if item['title'].lower() == title.lower()), None)
    
    if existing_item:
        if messagebox.askyesno("Update", f"'{title}' exists. Add new Carousel images?"):
            new_imgs = filedialog.askopenfilenames(title="SELECT CAROUSEL IMAGES")
            existing_item['carouselImages'].extend(copy_files(new_imgs, PAINTINGS_DIR))
            save_json(GALLERY_JSON, data)
            messagebox.showinfo("Success", "Images added to existing artwork!")
            combo_g_title.set('')
        return

    messagebox.showinfo("Step 1", "Select the MAIN Cover Image")
    cover_path = copy_files([filedialog.askopenfilename()], PAINTINGS_DIR)[0]
    
    messagebox.showinfo("Step 2", "Select ALL Carousel Images")
    carousel_paths = copy_files(filedialog.askopenfilenames(), PAINTINGS_DIR)

    new_item = {
        "title": title,
        "bgWord": title.split(' ')[0],
        "medium": entry_g_medium.get(),
        "size": entry_g_size.get(),
        "price": entry_g_price.get(),
        "desc": entry_g_desc.get("1.0", tk.END).strip(),
        "coverImage": cover_path,
        "carouselImages": carousel_paths
    }
    
    data.insert(0, new_item)
    save_json(GALLERY_JSON, data)
    messagebox.showinfo("Success", "Artwork added to Gallery data!")
    combo_g_title.set('')
    refresh_dropdowns()

# ==========================================
# TAB 2: DESIGN LOGIC (Add/Update)
# ==========================================
def manage_design():
    title = combo_d_title.get().strip()
    if not title:
        messagebox.showerror("Error", "Project Title is required!")
        return

    project_id = re.sub(r'[^a-z0-9]', '-', title.lower())
    data = load_json(DESIGN_JSON, {})
    
    if project_id in data:
        if messagebox.askyesno("Update", f"'{title}' exists. Add new Modal images?"):
            new_imgs = filedialog.askopenfilenames(title="SELECT MODAL IMAGES")
            data[project_id]['images'].extend(copy_files(new_imgs, DESIGN_DIR))
            save_json(DESIGN_JSON, data)
            messagebox.showinfo("Success", "Images added to project!")
            combo_d_title.set('')
        return

    messagebox.showinfo("Step 1", "Select the Tunnel Cover Image")
    cover_path = copy_files([filedialog.askopenfilename()], DESIGN_DIR)[0]
    
    messagebox.showinfo("Step 2", "Select ALL Modal Images")
    modal_paths = copy_files(filedialog.askopenfilenames(), DESIGN_DIR)

    data[project_id] = {
        "title": title,
        "desc": entry_d_desc.get("1.0", tk.END).strip(),
        "coverImage": cover_path,
        "images": modal_paths
    }
    
    save_json(DESIGN_JSON, data)
    messagebox.showinfo("Success", "Project added to Design data!")
    combo_d_title.set('')
    refresh_dropdowns()

# ==========================================
# TAB 3: DELETE LOGIC
# ==========================================
def delete_item():
    target = combo_del_title.get().strip()
    category = del_category.get()
    
    if not target: return

    if category == "Gallery":
        data = load_json(GALLERY_JSON, [])
        new_data = [item for item in data if item['title'].lower() != target.lower()]
        if len(new_data) < len(data):
            save_json(GALLERY_JSON, new_data)
            messagebox.showinfo("Deleted", f"'{target}' removed from Gallery.")
        else:
            messagebox.showwarning("Not Found", "Artwork not found.")
            
    elif category == "Design":
        project_id = re.sub(r'[^a-z0-9]', '-', target.lower())
        data = load_json(DESIGN_JSON, {})
        if project_id in data:
            del data[project_id]
            save_json(DESIGN_JSON, data)
            messagebox.showinfo("Deleted", f"'{target}' removed from Design.")
        else:
            messagebox.showwarning("Not Found", "Project not found.")
    
    combo_del_title.set('')
    refresh_dropdowns()

# ==========================================
# UI CONSTRUCTION
# ==========================================
root = tk.Tk()
root.title("Rachel Klompas - Portfolio Admin")
root.geometry("600x700")

notebook = ttk.Notebook(root)
notebook.pack(expand=True, fill='both', padx=15, pady=15)

# --- GALLERY UI ---
tab_g = ttk.Frame(notebook)
notebook.add(tab_g, text="🎨 Gallery")
tk.Label(tab_g, text="Title (Type new or select to update):").pack(pady=(10,0))
combo_g_title = ttk.Combobox(tab_g, width=47)
combo_g_title.pack()
tk.Label(tab_g, text="Medium:").pack(pady=(10,0)); entry_g_medium = tk.Entry(tab_g, width=50); entry_g_medium.pack()
tk.Label(tab_g, text="Size:").pack(pady=(10,0)); entry_g_size = tk.Entry(tab_g, width=50); entry_g_size.pack()
tk.Label(tab_g, text="Price:").pack(pady=(10,0)); entry_g_price = tk.Entry(tab_g, width=50); entry_g_price.pack()
tk.Label(tab_g, text="Description:").pack(pady=(10,0)); entry_g_desc = tk.Text(tab_g, height=4, width=50); entry_g_desc.pack()
tk.Button(tab_g, text="Process Gallery Entry", bg="#9db383", command=manage_gallery, pady=10).pack(pady=20)

# --- DESIGN UI ---
tab_d = ttk.Frame(notebook)
notebook.add(tab_d, text="📐 Design")
tk.Label(tab_d, text="Project Title (Type new or select to update):").pack(pady=(10,0))
combo_d_title = ttk.Combobox(tab_d, width=47)
combo_d_title.pack()
tk.Label(tab_d, text="Description:").pack(pady=(10,0)); entry_d_desc = tk.Text(tab_d, height=6, width=50); entry_d_desc.pack()
tk.Button(tab_d, text="Process Design Entry", bg="#b5a642", command=manage_design, pady=10).pack(pady=20)

# --- DELETE UI ---
tab_del = ttk.Frame(notebook)
notebook.add(tab_del, text="🗑️ Delete")
tk.Label(tab_del, text="Select Category:").pack(pady=10)
del_category = ttk.Combobox(tab_del, values=["Gallery", "Design"], state="readonly")
del_category.current(0); del_category.pack()
del_category.bind("<<ComboboxSelected>>", update_delete_dropdown)

tk.Label(tab_del, text="Select Item to Delete:").pack(pady=10)
combo_del_title = ttk.Combobox(tab_del, width=47, state="readonly")
combo_del_title.pack()
tk.Button(tab_del, text="PERMANENTLY DELETE", fg="red", command=delete_item, pady=10).pack(pady=20)

# Initialize dropdown lists on startup
refresh_dropdowns()

root.mainloop()