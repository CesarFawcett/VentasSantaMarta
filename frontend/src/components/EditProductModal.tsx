import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, AlertCircle, Package, Tag, DollarSign, Image as ImageIcon, Upload, List } from 'lucide-react';
import { Product, productService, Category } from '../services/productService';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSuccess: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product, onSuccess }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrl,
    isPromotion: product.isPromotion,
    discountPercentage: product.discountPercentage,
    category: product.category
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      isPromotion: product.isPromotion,
      discountPercentage: product.discountPercentage,
      category: product.category
    });
    loadCategories();
  }, [product, isOpen]);

  const loadCategories = async () => {
    try {
      const data = await productService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await productService.updateProduct(product.id, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError('Error al actualizar el producto. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (name === 'category') {
      const selectedCat = categories.find(c => c.id === value);
      setFormData(prev => ({ ...prev, category: selectedCat }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen es demasiado grande. Máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-[#064e3b]/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-2xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 relative z-10 shadow-2xl animate-reveal max-h-[95vh] md:max-h-[90vh] overflow-y-auto border border-[#064e3b]/5">
        <button onClick={onClose} className="absolute top-8 right-8 text-[#064e3b]/30 hover:text-[#064e3b] transition-colors bg-transparent border-none cursor-pointer">
          <X size={24} />
        </button>

        <div className="flex items-center gap-6 mb-10">
          <div className="h-16 w-16 bg-[#10b981]/10 rounded-3xl flex items-center justify-center text-[#10b981] shrink-0">
            <Package size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#064e3b] tracking-tight">Editar Producto</h2>
            <p className="text-[#064e3b]/50 text-sm font-medium">Modifica los detalles del producto en el catálogo.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 ml-4">Nombre del Producto</label>
            <div className="flex items-center h-14 bg-[#f0fdf4] rounded-full px-6 border border-[#064e3b]/10 focus-within:border-[#10b981] transition-colors gap-3">
              <Tag size={18} className="text-[#064e3b]/40 shrink-0" />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent border-none outline-none text-sm font-bold text-[#064e3b] w-full"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 ml-4">Categoría</label>
            <div className="flex items-center h-14 bg-[#f0fdf4] rounded-full px-6 border border-[#064e3b]/10 focus-within:border-[#10b981] transition-colors gap-3">
              <List size={18} className="text-[#064e3b]/40 shrink-0" />
              <select
                name="category"
                value={formData.category?.id || ''}
                onChange={handleChange}
                className="bg-transparent border-none outline-none text-sm font-bold text-[#064e3b] w-full cursor-pointer appearance-none"
                required
              >
                <option value="" disabled>Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 ml-4">Descripción Corta</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#f0fdf4] rounded-[2rem] p-6 border border-[#064e3b]/10 focus:border-[#10b981] outline-none text-sm font-bold text-[#064e3b] transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 ml-4">Precio (COP)</label>
            <div className="flex items-center h-14 bg-[#f0fdf4] rounded-full px-6 border border-[#064e3b]/10 focus-within:border-[#10b981] transition-colors gap-3">
              <DollarSign size={18} className="text-[#064e3b]/40 shrink-0" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="bg-transparent border-none outline-none text-sm font-bold text-[#064e3b] w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 ml-4">Stock disponible</label>
            <div className="flex items-center h-14 bg-[#f0fdf4] rounded-full px-6 border border-[#064e3b]/10 focus-within:border-[#10b981] transition-colors gap-3">
              <Package size={18} className="text-[#064e3b]/40 shrink-0" />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="bg-transparent border-none outline-none text-sm font-bold text-[#064e3b] w-full"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 ml-4">Imagen del Producto</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center h-14 bg-[#f0fdf4] rounded-full px-6 border border-[#064e3b]/10 focus-within:border-[#10b981] transition-colors gap-3">
                <ImageIcon size={18} className="text-[#064e3b]/40 shrink-0" />
                <input
                  placeholder="URL de la imagen..."
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="bg-transparent border-none outline-none text-sm font-bold text-[#064e3b] w-full"
                />
              </div>
              <label className="flex items-center justify-center h-14 bg-white rounded-full px-6 border-2 border-dashed border-[#10b981]/30 hover:border-[#10b981] transition-all gap-3 cursor-pointer group">
                <Upload size={18} className="text-[#10b981] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest text-[#10b981]">Subir Archivo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {formData.imageUrl && (
              <div className="mt-4 flex justify-center preview-container">
                <img src={formData.imageUrl} alt="Vista previa" className="h-24 w-24 object-cover rounded-2xl border-2 border-[#10b981]/20 shadow-lg" />
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex items-center justify-between p-6 bg-[#f0fdf4] rounded-[2rem] border border-[#064e3b]/10">
            <div className="flex flex-col">
              <span className="text-sm font-black text-[#064e3b]">Gestión de Oferta</span>
              <span className="text-[10px] font-bold text-[#064e3b]/40 uppercase">
                {formData.isPromotion ? 'Oferta Activa' : 'Valor de Próxima Oferta (Próximamente)'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center h-10 bg-white rounded-full px-4 border border-[#10b981]/30 focus-within:border-[#10b981] gap-2">
                 <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  className="w-10 bg-transparent border-none outline-none text-xs font-black text-[#10b981] text-center"
                />
                <span className="text-[10px] font-black text-[#10b981]">%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-[#064e3b]/40 uppercase mb-1">Activar</span>
                <input
                  type="checkbox"
                  name="isPromotion"
                  checked={formData.isPromotion}
                  onChange={handleCheckboxChange}
                  className="w-12 h-6 rounded-full appearance-none bg-[#064e3b]/10 checked:bg-[#10b981] relative cursor-pointer transition-all duration-300 before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:left-7 before:transition-all"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="md:col-span-2 flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-3xl text-xs font-bold animate-reveal">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="md:col-span-2 flex gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 rounded-full border-2 border-[#064e3b]/10 text-[#064e3b] font-black uppercase text-xs tracking-widest hover:bg-[#064e3b]/5 transition-all bg-transparent cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary h-14 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#10b981]/20 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : (
                <><Save size={18} /> Guardar Cambios</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
