function getDate() {
    const date = new Date();
    const year = date.getFullYear();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return { year, month, day };
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours * 60 + minutes; // Convert time to minutes
}

function timeUntilNextPrayer(prayers) {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    let minTimeDifference = Infinity;
    let nextPrayerTime = null;

    for (const prayer in prayers) {
        const [hours, minutes] = prayers[prayer].split(':').map(Number);
        const prayerTotalMinutes = hours * 60 + minutes;

        if (prayerTotalMinutes > currentTotalMinutes) {
            const timeDifference = prayerTotalMinutes - currentTotalMinutes;
            if (timeDifference < minTimeDifference) {
                minTimeDifference = timeDifference;
                nextPrayerTime = prayer;
            }
        }
    }

    if (nextPrayerTime !== null) {
        const hoursDifference = Math.floor(minTimeDifference / 60);
        const minutesDifference = minTimeDifference % 60;
        return `${hoursDifference} hours and ${minutesDifference} minutes until ${nextPrayerTime}`;
    } else {
        return "No upcoming prayers for today";
    }
}

function subtractTimes(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    
    const totalMinutes1 = hours1 * 60 + minutes1; // Convert time to minutes
    const totalMinutes2 = hours2 * 60 + minutes2; // Convert time to minutes
    
    const differenceInMinutes = totalMinutes1 - totalMinutes2;
    
    const hoursDifference = Math.floor(differenceInMinutes / 60);
    const minutesDifference = differenceInMinutes % 60;
    
    return `${hoursDifference}:${minutesDifference < 10 ? '0' + minutesDifference : minutesDifference}`;
}



async function fetchData() {
    try {
        const fajrTime = document.getElementById("fajr");
        const dhuhrTime = document.getElementById("dhuhr");
        const asrTime = document.getElementById("asr");
        const maghribTime = document.getElementById("maghrib");
        const ishaTime = document.getElementById("isha");
        const nextPrayer = document.getElementById("nextPrayer");
        const city = document.getElementById("city").value;

        const formattedCity = city.substring(0, 1).toUpperCase() + city.substring(1);

        const { year, month, day } = getDate();
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;

        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${formattedDay}-${formattedMonth}-${year}?city=${formattedCity}&country=&method=8`);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const info = await response.json();

        // Display prayer timings
        fajrTime.innerHTML = `Fajr: ${info.data.timings.Fajr}`;
        dhuhrTime.innerHTML = `Dhuhr: ${info.data.timings.Dhuhr}`;
        asrTime.innerHTML = `Asr: ${info.data.timings.Asr}`;
        maghribTime.innerHTML = `Maghrib: ${info.data.timings.Maghrib}`;
        ishaTime.innerHTML = `Isha: ${info.data.timings.Isha}`;

        // Determine next prayer
        const currentTime = getCurrentTime();
        const prayers = {
            Fajr: info.data.timings.Fajr,
            Dhuhr: info.data.timings.Dhuhr,
            Asr: info.data.timings.Asr,
            Maghrib: info.data.timings.Maghrib,
            Isha: info.data.timings.Isha,
        };
        const nextPrayerIn = timeUntilNextPrayer(prayers);
        nextPrayer.innerHTML = `Next Prayer: ${nextPrayerIn}`;

    } catch (error) {
        console.error(error);
    }
}

document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    fetchData();
});

