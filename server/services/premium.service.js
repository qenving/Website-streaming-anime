import { getDb } from "../db/database.js";

export const getPremiumContent = () => {
  const db = getDb();
  const plans = db.prepare("SELECT * FROM plans ORDER BY price_monthly ASC").all();
  const features = db.prepare("SELECT plan_id, feature FROM plan_features").all();
  const benefits = db.prepare("SELECT id, title, description FROM benefits").all();
  const promos = db.prepare("SELECT id, title, copy, action FROM promos").all();

  const featureMap = new Map();
  features.forEach((item) => {
    const collection = featureMap.get(item.plan_id) ?? [];
    collection.push(item.feature);
    featureMap.set(item.plan_id, collection);
  });

  const serializedPlans = plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    priceMonthly: plan.price_monthly,
    priceYearly: plan.price_yearly,
    highlight: Boolean(plan.highlight),
    features: featureMap.get(plan.id) ?? [],
  }));

  return {
    plans: serializedPlans,
    benefits: benefits.map((item) => ({ ...item })),
    promos: promos.map((item) => ({ ...item })),
  };
};
