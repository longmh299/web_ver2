import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title } = await req.json();

  const prompt = `
Bạn là chuyên gia SEO content.

Viết bài bằng tiếng Việt, HTML sạch.

YÊU CẦU:
- Không dùng style=""
- Dùng <h2> cho mỗi section
- Có đoạn tóm tắt đầu bài
- Có list bullet
- Có kết luận

FORMAT CHÍNH XÁC:

<div class="ai-summary">
Tóm tắt ngắn 2-3 câu
</div>

<h2>Giới thiệu</h2>
<p>...</p>

<h2>Ưu điểm</h2>
<ul>
<li>...</li>
</ul>

<h2>Kết luận</h2>
<p>...</p>

Chủ đề: ${title}
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await res.json();

  return NextResponse.json({
    content: data.choices?.[0]?.message?.content || "",
  });
}