export const translations = {
    vi: {
        // Home
        greeting: "Chào {name}, Keep it up!",
        habitsToday: "Bạn có {count} thói quen hôm nay",
        progressToday: "Tiến độ hôm nay",
        habitsCompleted: "{completed}/{total} thói quen hoàn thành",
        todayHabits: "Thói quen hôm nay",
        addNew: "Thêm mới",

        // History
        photoHistory: "Lịch sử Ảnh",
        statistics: "Thống kê",
        photosTaken: "Ảnh đã chụp",
        thisMonth: "Tháng này",

        // Pomodoro
        pomodoroTimer: "Pomodoro Timer",
        work: "Làm việc",
        shortBreak: "Nghỉ ngắn",
        longBreak: "Nghỉ dài",
        focusTime: "Tập trung làm việc",
        breakTime: "Thời gian nghỉ ngơi",
        start: "Bắt đầu",
        pause: "Tạm dừng",
        pomodoroToday: "Pomodoro hôm nay",

        // Profile
        memberSince: "Thành viên từ {date}",
        badges: "Huy hiệu",
        points: "Điểm",
        days: "Ngày",
        settings: "Cài đặt",
        notifications: "Thông báo",
        darkMode: "Chế độ tối",
        language: "Ngôn ngữ",
        about: "Về Habit Snap",
        version: "Phiên bản {version}",
        clearData: "Xóa tất cả dữ liệu",

        // Navigation
        home: "Trang chủ",
        history: "Lịch",
        add: "Thêm",
        pomodoro: "Thống kê", // User wants this labeled Stats based on context
        profile: "Cá nhân",

        // History Tabs
        moments: "Khoảnh khắc",
        yours: "Của bạn",
        tabPhotos: "Ảnh",
        tabCalendar: "Lịch",
        tabStats: "Thống kê",
        totalPhotos: "Tổng ảnh",
        monthlyStats: "Tháng này",

        // Days of week
        sun: "CN",
        mon: "T2",
        tue: "T3",
        wed: "T4",
        thu: "T5",
        fri: "T6",
        sat: "T7",

        // Months
        january: "Tháng 1",
        february: "Tháng 2",
        march: "Tháng 3",
        april: "Tháng 4",
        may: "Tháng 5",
        june: "Tháng 6",
        july: "Tháng 7",
        august: "Tháng 8",
        september: "Tháng 9",
        october: "Tháng 10",
        november: "Tháng 11",
        december: "Tháng 12",

        // Actions
        delete: "Xóa",
        edit: "Chỉnh sửa",
        save: "Lưu",
        cancel: "Hủy",
        confirm: "Xác nhận",

        // Habit
        habitName: "Tên thói quen",
        habitIcon: "Biểu tượng",
        habitColor: "Màu sắc",
        streak: "{count} ngày liên tiếp",
        createHabit: "Tạo thói quen mới",
        editHabit: "Chỉnh sửa thói quen",
        deleteHabit: "Xóa thói quen",
        deleteConfirm: "Bạn có chắc muốn xóa thói quen này?",
    },
    en: {
        // Home
        greeting: "Hi {name}, Keep it up!",
        habitsToday: "You have {count} habits today",
        progressToday: "Today's Progress",
        habitsCompleted: "{completed}/{total} habits completed",
        todayHabits: "Today's Habits",
        addNew: "Add New",

        // History
        photoHistory: "Photo History",
        statistics: "Statistics",
        photosTaken: "Photos Taken",
        thisMonth: "This Month",

        // Pomodoro
        pomodoroTimer: "Pomodoro Timer",
        work: "Work",
        shortBreak: "Short Break",
        longBreak: "Long Break",
        focusTime: "Focus Time",
        breakTime: "Break Time",
        start: "Start",
        pause: "Pause",
        pomodoroToday: "Pomodoros Today",

        // Profile
        memberSince: "Member since {date}",
        badges: "Badges",
        points: "Points",
        days: "Days",
        settings: "Settings",
        notifications: "Notifications",
        darkMode: "Dark Mode",
        language: "Language",
        about: "About Habit Snap",
        version: "Version {version}",
        clearData: "Clear All Data",

        // Navigation
        home: "Home",
        history: "History",
        add: "Add",
        pomodoro: "Stats",
        profile: "Profile",

        // History Tabs
        moments: "Moments",
        yours: "Yours",
        tabPhotos: "Photos",
        tabCalendar: "Calendar",
        tabStats: "Statistics",
        totalPhotos: "Total Photos",
        monthlyStats: "Monthly",

        // Days of week
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",

        // Months
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December",

        // Actions
        delete: "Delete",
        edit: "Edit",
        save: "Save",
        cancel: "Cancel",
        confirm: "Confirm",

        // Habit
        habitName: "Habit Name",
        habitIcon: "Icon",
        habitColor: "Color",
        streak: "{count} day streak",
        createHabit: "Create New Habit",
        editHabit: "Edit Habit",
        deleteHabit: "Delete Habit",
        deleteConfirm: "Are you sure you want to delete this habit?",
    },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.vi;
