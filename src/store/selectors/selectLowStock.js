export const selectLowStock = (state) => {
  const crops = state.crops || [];

  return crops.filter((crop) => {
    const stock = Number(
      crop.quantity ?? crop.stock ?? 0
    );

    const threshold = Number(
      crop.lowStockThreshold ?? 10
    );

    return stock <= threshold;
  });
};