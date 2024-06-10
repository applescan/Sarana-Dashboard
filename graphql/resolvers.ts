import { Context } from "../pages/api/graphql";
import { Prisma } from '@prisma/client';

export const resolvers = {
    Query: {
        orders: async (_: any, args: { startDate?: string, endDate?: string }, context: Context) => {
            const where: Prisma.OrderWhereInput = {};

            if (args.startDate && args.endDate) {
                where.createdAt = {
                    gte: new Date(args.startDate),
                    lte: new Date(args.endDate)
                };
            } else if (args.startDate) {
                where.createdAt = { gte: new Date(args.startDate) };
            } else if (args.endDate) {
                where.createdAt = { lte: new Date(args.endDate) };
            }

            return await context.prisma.order.findMany({
                where,
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        },
        order: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.order.findUnique({
                where: { id: args.id },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        },
        products: async (_: any, __: any, context: Context) => {
            return await context.prisma.product.findMany({
                include: {
                    category: true,
                    orderItems: true,
                    itemsSold: true,
                    itemsRestocked: true,
                },
            });
        },
        product: async (_: any, args: { id: string }, context: Context) => {
            return await context.prisma.product.findUnique({
                where: { id: args.id },
                include: {
                    category: true,
                    orderItems: true,
                    itemsSold: true,
                    itemsRestocked: true,
                },
            });
        },
        categories: async (_: any, __: any, context: Context) => {
            return await context.prisma.category.findMany({
                include: {
                    products: {
                        include: {
                            orderItems: true,
                            itemsSold: true,
                            itemsRestocked: true,
                        },
                    },
                },
            });
        },
        category: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.category.findUnique({
                where: { id: args.id },
                include: {
                    products: {
                        include: {
                            orderItems: true,
                            itemsSold: true,
                            itemsRestocked: true,
                        },
                    },
                },
            });
        },
        itemsSold: async (_: any, args: { startDate?: string, endDate?: string }, context: Context) => {
            const where: Prisma.ItemsSoldWhereInput = {};

            if (args.startDate && args.endDate) {
                where.createdAt = {
                    gte: new Date(args.startDate),
                    lte: new Date(args.endDate)
                };
            } else if (args.startDate) {
                where.createdAt = { gte: new Date(args.startDate) };
            } else if (args.endDate) {
                where.createdAt = { lte: new Date(args.endDate) };
            }

            return await context.prisma.itemsSold.findMany({
                where,
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            });
        },
        itemSold: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.itemsSold.findUnique({
                where: { id: args.id },
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            });
        },
        itemsRestocked: async (_: any, args: { startDate?: string, endDate?: string }, context: Context) => {
            const where: Prisma.ItemsRestockedWhereInput = {};

            if (args.startDate && args.endDate) {
                where.createdAt = {
                    gte: new Date(args.startDate),
                    lte: new Date(args.endDate)
                };
            } else if (args.startDate) {
                where.createdAt = { gte: new Date(args.startDate) };
            } else if (args.endDate) {
                where.createdAt = { lte: new Date(args.endDate) };
            }

            return await context.prisma.itemsRestocked.findMany({
                where,
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            });
        },
        itemRestocked: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.itemsRestocked.findUnique({
                where: { id: args.id },
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            });
        },
        revenues: async (_: any, args: { startDate?: string, endDate?: string }, context: Context) => {
            const where: Prisma.RevenueWhereInput = {};

            if (args.startDate && args.endDate) {
                where.date = {
                    gte: new Date(args.startDate),
                    lte: new Date(args.endDate)
                };
            } else if (args.startDate) {
                where.date = { gte: new Date(args.startDate) };
            } else if (args.endDate) {
                where.date = { lte: new Date(args.endDate) };
            }

            return await context.prisma.revenue.findMany({ where });
        },
        revenue: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.revenue.findUnique({
                where: { id: args.id },
            });
        },
    },
    Mutation: {
        createOrders: async (_: any, args: any, context: Context) => {
            return await context.prisma.order.createMany({
                data: args.orders,
            });
        },
        updateOrders: async (_: any, args: any, context: Context) => {
            const updatePromises = args.orders.map((order: any) =>
                context.prisma.order.update({
                    where: { id: order.id },
                    data: { totalAmount: order.totalAmount },
                })
            );
            return await Promise.all(updatePromises);
        },
        deleteOrders: async (_: any, args: { ids: number[] }, context: Context) => {
            return await context.prisma.order.deleteMany({
                where: { id: { in: args.ids } },
            });
        },
        createOrderItems: async (_: any, args: any, context: Context) => {
            const orderItems = args.orderItems;

            // Create order items and update product stock in a transaction
            return await context.prisma.$transaction(async (prisma) => {
                const createdOrderItems = await prisma.orderItem.createMany({
                    data: orderItems,
                });

                const updateStockPromises = orderItems.map((item: any) =>
                    prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    })
                );

                await Promise.all(updateStockPromises);

                return createdOrderItems;
            });
        },
        updateOrderItems: async (_: any, args: any, context: Context) => {
            const updatePromises = args.orderItems.map((orderItem: any) =>
                context.prisma.orderItem.update({
                    where: { id: orderItem.id },
                    data: { quantity: orderItem.quantity, price: orderItem.price },
                })
            );
            return await Promise.all(updatePromises);
        },
        deleteOrderItems: async (_: any, args: { ids: number[] }, context: Context) => {
            return await context.prisma.orderItem.deleteMany({
                where: { id: { in: args.ids } },
            });
        },
        createProducts: async (_: any, args: any, context: Context) => {
            return await context.prisma.product.createMany({
                data: args.products,
            });
        },
        updateProducts: async (_: any, args: any, context: Context) => {
            const updatePromises = args.products.map((product: any) =>
                context.prisma.product.update({
                    where: { id: product.id },
                    data: {
                        name: product.name,
                        description: product.description,
                        buyPrice: product.buyPrice,
                        sellPrice: product.sellPrice,
                        stock: product.stock,
                        categoryId: product.categoryId,
                    },
                })
            );
            return await Promise.all(updatePromises);
        },
        deleteProducts: async (_: any, args: { ids: string[] }, context: Context) => {
            return await context.prisma.product.deleteMany({
                where: { id: { in: args.ids } },
            });
        },
        createCategories: async (_: any, args: any, context: Context) => {
            return await context.prisma.category.createMany({
                data: args.categories,
            });
        },
        updateCategories: async (_: any, args: any, context: Context) => {
            const updatePromises = args.categories.map((category: any) =>
                context.prisma.category.update({
                    where: { id: category.id },
                    data: { name: category.name },
                })
            );
            return await Promise.all(updatePromises);
        },
        deleteCategories: async (_: any, args: { ids: number[] }, context: Context) => {
            return await context.prisma.category.deleteMany({
                where: { id: { in: args.ids } },
            });
        },
        recordItemsSold: async (_: any, args: any, context: Context) => {
            const itemsSold = args.itemsSold;

            // Record items sold and update product stock in a transaction
            return await context.prisma.$transaction(async (prisma) => {
                const recordedItemsSold = await prisma.itemsSold.createMany({
                    data: itemsSold,
                });

                const updateStockPromises = itemsSold.map((item: any) =>
                    prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    })
                );

                await Promise.all(updateStockPromises);

                return recordedItemsSold;
            });
        },
        recordRevenue: async (_: any, args: any, context: Context) => {
            return await context.prisma.revenue.createMany({
                data: args.revenue,
            });
        },
        recordItemsRestocked: async (_: any, args: any, context: Context) => {
            const itemsRestocked = args.itemsRestocked;

            // Record items restocked and update product stock in a transaction
            return await context.prisma.$transaction(async (prisma) => {
                const recordedItemsRestocked = await prisma.itemsRestocked.createMany({
                    data: itemsRestocked,
                });

                const updateStockPromises = itemsRestocked.map((item: any) =>
                    prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                        },
                    })
                );

                await Promise.all(updateStockPromises);

                return recordedItemsRestocked;
            });
        },
    },
    Category: {
        products: async (parent: any, _: any, context: Context) => {
            return await context.prisma.product.findMany({
                where: { categoryId: parent.id },
                include: {
                    orderItems: true,
                    itemsSold: true,
                    itemsRestocked: true,
                },
            });
        },
        itemsSold: async (parent: any, _: any, context: Context) => {
            return await context.prisma.itemsSold.findMany({
                where: {
                    product: {
                        categoryId: parent.id,
                    },
                },
                include: {
                    product: true,
                },
            });
        },
    },
    Product: {
        category: async (parent: any, _: any, context: Context) => {
            return await context.prisma.category.findUnique({
                where: { id: parent.categoryId },
            });
        },
        orderItems: async (parent: any, _: any, context: Context) => {
            return await context.prisma.orderItem.findMany({
                where: { productId: parent.id },
                include: {
                    order: true,
                },
            });
        },
        itemsSold: async (parent: any, _: any, context: Context) => {
            return await context.prisma.itemsSold.findMany({
                where: { productId: parent.id },
            });
        },
        itemsRestocked: async (parent: any, _: any, context: Context) => {
            return await context.prisma.itemsRestocked.findMany({
                where: { productId: parent.id },
            });
        },
    },
};
