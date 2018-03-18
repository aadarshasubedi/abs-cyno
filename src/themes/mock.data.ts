export const makeMockData = function(){
    const data: any = {};
    const totalPeriodCount = 24;//24期
    //收益率参考类型
    data.rateTypes = [{id: 1, text: '收益率参考1'}, {id: 2, text: '收益率参考2'}, {id: 3, text: '收益率参考3'}, {id: 4, text: '收益率参考4'}];

    //每期收益率
    data.periodRate = [];
    data.rateTypes.forEach(element => {
        let i = 0;
        while (i <= totalPeriodCount) {
            data.periodRate.push({
                type: element.id,
                typeDesc: element.text,
                periodNum: i,
                rate: (0 + (i * 0.02)) + (element.id * 0.005)
            });

            i = i + 3;
        }
    });

    //收益率概率分布数据
    data.chances = [];
    let r: number = 0;
    for (let i = 0; i <= 100; i++) {
        r = i < 65 ? (i * 0.001) : (r - 0.001);
        data.chances.push({
            chance: (i * 0.01),
            rate: r
        });
    }

    return data;
}