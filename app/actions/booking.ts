"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function reserveClass(prevState: any, formData: FormData) {
  const classId = formData.get("classId") as string;
  const sessionId = formData.get("sessionId") as string;
  const headCount = Number(formData.get("headCount"));

  if (!classId || !sessionId || !headCount || headCount < 1) {
    return { message: "잘못된 요청입니다. 필수 정보를 확인해주세요." };
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    // Phase 1: Redirect to login if not authenticated
    // Ideally this should be handled by middleware, but double check here
    return { message: "로그인이 필요한 서비스입니다." };
  }

  try {
    const { data: reservationId, error } = await supabase.rpc("create_reservation", {
      p_user_id: user.id,
      p_session_id: sessionId,
      p_head_count: headCount
    });

    if (error) {
      console.error("Booking Error:", error);
      // Handle known errors (e.g. Capacity exceeded)
      if (error.message.includes("Capacity exceeded")) {
          return { message: "예약 인원이 잔여석을 초과했습니다." };
      }
      return { message: "예약 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
    }

    revalidatePath(`/classes/${classId}`);
    revalidatePath("/my/reservations");
    
  } catch (err) {
      console.error("Unexpected Error:", err);
      return { message: "알 수 없는 오류가 발생했습니다." };
  }


  // Return success instead of redirecting, so client can show Toast
  return { success: true, message: "예약이 확정되었습니다!" };
}

export async function cancelReservation(reservationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  try {
    const { error } = await supabase.rpc("cancel_reservation", {
      p_reservation_id: reservationId,
      p_user_id: user.id
    });

    if (error) {
      console.error("Cancellation Error:", error);
      return { success: false, message: error.message || "예약 취소에 실패했습니다." };
    }

    revalidatePath("/my/reservations");
    return { success: true, message: "예약이 정상적으로 취소되었습니다." };
  } catch (error) {
    console.error("Cancel Action Error:", error);
    return { success: false, message: "처리 중 오류가 발생했습니다." };
  }
}
