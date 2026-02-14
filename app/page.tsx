import { createClient } from "@/lib/supabase/server";
import { ClassGrid } from "@/components/classes/ClassGrid";
import { CategoryFilter } from "@/components/classes/CategoryFilter";
import { RegionFilter } from "@/components/classes/RegionFilter";
import { ClassWithStudio } from "@/types/class";

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    region?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = await createClient();
  const { category, region } = await searchParams;

  let query = supabase
    .from("classes")
    .select("*, studios(name, location_text, region_code)")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  // Region filtering
  // Using !inner to filter by foreign table column
  if (region) {
     query = supabase
        .from("classes")
        .select("*, studios!inner(name, location_text, region_code)") 
        .eq("studios.region_code", region)
        .order("created_at", { ascending: false });
      
     if (category) {
         query = query.eq("category", category);
     }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase Error fetching classes:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      fullError: JSON.stringify(error, null, 2)
    });
  }

  const classes = (data || []) as unknown as ClassWithStudio[];

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center pt-20">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          취미를 시작하는 가장 쉬운 방법
        </h1>
        <p className="text-xl text-muted-foreground">
          요리, 베이킹, 공예, 음악 등 다양한 클래스를 만나보세요.
        </p>
      </section>

      <section>
        <div className="flex flex-col gap-4 mb-10">
          <CategoryFilter />
          <RegionFilter />
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">클래스 목록</h2>
          <div className="text-sm text-muted-foreground">
             전체 {classes.length}개
          </div>
        </div>
        
        <ClassGrid classes={classes} />
      </section>
    </main>
  );
}
