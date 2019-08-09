
export const UtilityService = {
     getTimeDifference(time: any) {
         const givenTime =new Date(time).getTime()/1000
        const current = new Date().getTime() / 1000
        const min = (current - givenTime) / 60;
        const hour = min / 60;
        const day = hour / 24;
        const month = day / 30;
        const year = month / 12
        if (year < 1) {
            if (month < 1) {
                if (day < 1) {
                    if (hour < 1) {
                        if (min > 10) {
                            return parseInt(min + "") + " min"

                        } else {
                            return "few mins ago"
                        }
                    } else {
                        if (hour < 2) {
                            return parseInt(hour + "") + " hr ago"

                        } else {
                            return parseInt(hour + "") + " hrs ago"

                        }
                    }
                } else {
                    if (day < 2) {
                        return parseInt(day + "") + " day ago"

                    } else {
                        return parseInt(day + "") + " days ago"

                    }

                }
            } else {
                if (month < 2) {
                    return parseInt(month + "") + " month ago"

                } else {
                    return parseInt(month + "") + " months ago"

                }

            }
        } else {
            if (year < 2) {
                return parseInt(year + "") + " year ago"

            } else {
                return parseInt(year + "") + " years ago"

            }

        }

    }
}