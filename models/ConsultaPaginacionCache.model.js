import mongoose, { Schema, Document, Model } from 'mongoose';
const CachePaginacion = new Schema({
    QueryString: {
      type: String,
      required: true,
      // index: true
    },
    TamañoTotal: {
        type: Number,
        required: true,
        // index: true
      },

}
);

export default mongoose.model('paginacioncache_consultas',CachePaginacion)