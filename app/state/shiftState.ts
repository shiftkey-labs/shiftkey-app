import { observable } from "@legendapp/state";
import { getAvailableShifts, claimShift } from "@/api/shiftApi";

interface Shift {
  id: string;
  shiftTime: string;
  isAvailable: boolean;
}

interface EventWithShifts {
  id: string;
  title: string;
  location: string;
  startDate: string;
  images: Array<{ url: string }>;
  availableShifts: Shift[];
  totalAvailableShifts: number;
}

interface ShiftState {
  events: EventWithShifts[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const shiftState = observable<ShiftState>({
  events: [],
  loading: false,
  error: null,
  lastUpdated: null,
});

// Function to fetch available shifts
const fetchAvailableShifts = async () => {
  try {
    console.log("🔄 fetchAvailableShifts called");
    shiftState.loading.set(true);
    shiftState.error.set(null);
    console.log("🔄 Loading set to true");
    
    const shifts = await getAvailableShifts();
    console.log("✅ Received shifts:", shifts?.length, "items");
    shiftState.events.set(shifts);
    shiftState.lastUpdated.set(Date.now());
    console.log("✅ State updated");
  } catch (error) {
    console.error("❌ Error fetching shifts:", error);
    shiftState.error.set(error.message || "Failed to fetch shifts");
  } finally {
    shiftState.loading.set(false);
    console.log("✅ Loading set to false");
  }
};

// Function to claim a shift with optimistic update
const claimShiftOptimistic = async (shiftId: string, userId: string) => {
  try {
    // Find the event and shift
    const events = shiftState.events.get();
    let eventIndex = -1;
    let shiftIndex = -1;
    
    for (let i = 0; i < events.length; i++) {
      const shiftIdx = events[i].availableShifts.findIndex(shift => shift.id === shiftId);
      if (shiftIdx !== -1) {
        eventIndex = i;
        shiftIndex = shiftIdx;
        break;
      }
    }
    
    if (eventIndex === -1 || shiftIndex === -1) {
      throw new Error("Shift not found");
    }
    
    // Optimistically remove the shift from available shifts
    const updatedEvents = [...events];
    updatedEvents[eventIndex] = {
      ...updatedEvents[eventIndex],
      availableShifts: updatedEvents[eventIndex].availableShifts.filter(shift => shift.id !== shiftId),
      totalAvailableShifts: updatedEvents[eventIndex].totalAvailableShifts - 1
    };
    
    // If no shifts left, remove the event entirely
    if (updatedEvents[eventIndex].totalAvailableShifts === 0) {
      updatedEvents.splice(eventIndex, 1);
    }
    
    shiftState.events.set(updatedEvents);
    
    // Make the API call
    await claimShift(shiftId, userId);
    
    return { success: true };
  } catch (error) {
    console.error("Error claiming shift:", error);
    // Revert optimistic update by refetching
    await fetchAvailableShifts();
    throw error;
  }
};

// Function to refresh shifts if data is stale
const refreshIfStale = async (maxAge = 5 * 60 * 1000) => { // 5 minutes
  const lastUpdated = shiftState.lastUpdated.get();
  const now = Date.now();
  
  if (!lastUpdated || now - lastUpdated > maxAge) {
    await fetchAvailableShifts();
  }
};

export { 
  shiftState, 
  fetchAvailableShifts, 
  claimShiftOptimistic, 
  refreshIfStale 
};