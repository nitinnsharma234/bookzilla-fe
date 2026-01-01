import React from "react";

const CategorySlug = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return <div className="text-red">Categories ${slug}</div>;
};

export default CategorySlug;
