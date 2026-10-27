export const selectDueCrops = (state) => {
  const crops = state.crops || [];
  const today = new Date().toISOString().slice(0, 10);

  return crops.filter((crop) => {
    const cuttingDate = crop.cuttingDate || crop.harvestDate;

    return (
      cuttingDate &&
      cuttingDate <= today &&
      crop.status !== "Harvested"
    );
  });
};