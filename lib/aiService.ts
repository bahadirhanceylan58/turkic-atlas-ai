export async function generateHistoryAnalysis(stateName: string, year: number): Promise<string> {
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return `${stateName} için ${year} yılı stratejik analizi: İpek Yolu hakimiyeti sebebiyle ekonomik güç dorukta. Batı sınırlarında askeri hareketlilik tespit edildi.`;
}
