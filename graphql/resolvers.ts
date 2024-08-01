import { Prisma } from '@prisma/client';
import { Context } from '../pages/api/graphql';

export const resolvers = {
  Query: {
    orders: async (
      _: unknown,
      args: { startDate?: string; endDate?: string },
      context: Context,
    ) => {
      const where: Prisma.OrderWhereInput = {};

      if (args.startDate && args.endDate) {
        where.createdAt = {
          gte: new Date(args.startDate),
          lte: new Date(args.endDate),
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
    order: async (_: unknown, args: { id: number }, context: Context) => {
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
    products: async (_: unknown, __: unknown, context: Context) => {
      return await context.prisma.product.findMany({
        include: {
          category: true,
          orderItems: true,
          itemsSold: true,
          itemsRestocked: true,
        },
      });
    },
    product: async (_: unknown, args: { id: string }, context: Context) => {
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
    categories: async (_: unknown, __: unknown, context: Context) => {
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
    category: async (_: unknown, args: { id: number }, context: Context) => {
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
    itemsSold: async (
      _: unknown,
      args: { startDate?: string; endDate?: string },
      context: Context,
    ) => {
      const where: Prisma.ItemsSoldWhereInput = {};

      if (args.startDate && args.endDate) {
        where.createdAt = {
          gte: new Date(args.startDate),
          lte: new Date(args.endDate),
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
    itemSold: async (_: unknown, args: { id: number }, context: Context) => {
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
    itemsRestocked: async (
      _: unknown,
      args: { startDate?: string; endDate?: string },
      context: Context,
    ) => {
      const where: Prisma.ItemsRestockedWhereInput = {};

      if (args.startDate && args.endDate) {
        where.createdAt = {
          gte: new Date(args.startDate),
          lte: new Date(args.endDate),
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
    itemRestocked: async (
      _: unknown,
      args: { id: number },
      context: Context,
    ) => {
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
    revenues: async (
      _: unknown,
      args: { startDate?: string; endDate?: string },
      context: Context,
    ) => {
      const where: Prisma.RevenueWhereInput = {};

      if (args.startDate && args.endDate) {
        where.date = {
          gte: new Date(args.startDate),
          lte: new Date(args.endDate),
        };
      } else if (args.startDate) {
        where.date = { gte: new Date(args.startDate) };
      } else if (args.endDate) {
        where.date = { lte: new Date(args.endDate) };
      }

      return await context.prisma.revenue.findMany({ where });
    },
    revenue: async (_: unknown, args: { id: number }, context: Context) => {
      return await context.prisma.revenue.findUnique({
        where: { id: args.id },
      });
    },
  },
  Mutation: {
    createOrders: async (
      _: unknown,
      args: { orders: Prisma.OrderCreateManyInput[] },
      context: Context,
    ) => {
      return await context.prisma.order.createMany({
        data: args.orders,
      });
    },
    updateOrders: async (
      _: unknown,
      args: { orders: { id: number; totalAmount: number }[] },
      context: Context,
    ) => {
      const updatePromises = args.orders.map((order) =>
        context.prisma.order.update({
          where: { id: order.id },
          data: { totalAmount: order.totalAmount },
        }),
      );
      return await Promise.all(updatePromises);
    },
    deleteOrders: async (
      _: unknown,
      args: { ids: number[] },
      context: Context,
    ) => {
      return await context.prisma.order.deleteMany({
        where: { id: { in: args.ids } },
      });
    },
    createOrderItems: async (
      _: unknown,
      args: { orderItems: Prisma.OrderItemCreateManyInput[] },
      context: Context,
    ) => {
      return await context.prisma.$transaction(async (prisma) => {
        const createdOrderItems = await prisma.orderItem.createMany({
          data: args.orderItems,
        });

        const updateStockPromises = args.orderItems.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }),
        );

        await Promise.all(updateStockPromises);

        return createdOrderItems;
      });
    },
    updateOrderItems: async (
      _: unknown,
      args: { orderItems: { id: number; quantity?: number; price?: number }[] },
      context: Context,
    ) => {
      const updatePromises = args.orderItems.map((orderItem) =>
        context.prisma.orderItem.update({
          where: { id: orderItem.id },
          data: { quantity: orderItem.quantity, price: orderItem.price },
        }),
      );
      return await Promise.all(updatePromises);
    },
    deleteOrderItems: async (
      _: unknown,
      args: { ids: number[] },
      context: Context,
    ) => {
      return await context.prisma.orderItem.deleteMany({
        where: { id: { in: args.ids } },
      });
    },
    createProducts: async (
      _: unknown,
      args: { products: Prisma.ProductCreateManyInput[] },
      context: Context,
    ) => {
      return await context.prisma.product.createMany({
        data: args.products,
      });
    },
    updateProducts: async (
      _: unknown,
      args: {
        products: {
          id: string;
          name?: string;
          description?: string;
          buyPrice?: number;
          sellPrice?: number;
          stock?: number;
          categoryId?: number;
        }[];
      },
      context: Context,
    ) => {
      const updatePromises = args.products.map((product) =>
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
        }),
      );
      return await Promise.all(updatePromises);
    },
    deleteProducts: async (
      _: unknown,
      args: { ids: string[] },
      context: Context,
    ) => {
      return await context.prisma.product.deleteMany({
        where: { id: { in: args.ids } },
      });
    },
    createCategories: async (
      _: unknown,
      args: { categories: Prisma.CategoryCreateManyInput[] },
      context: Context,
    ) => {
      return await context.prisma.category.createMany({
        data: args.categories,
      });
    },
    updateCategories: async (
      _: unknown,
      args: { categories: { id: number; name: string }[] },
      context: Context,
    ) => {
      const updatePromises = args.categories.map((category) =>
        context.prisma.category.update({
          where: { id: category.id },
          data: { name: category.name },
        }),
      );
      return await Promise.all(updatePromises);
    },
    deleteCategories: async (
      _: unknown,
      args: { ids: number[] },
      context: Context,
    ) => {
      return await context.prisma.category.deleteMany({
        where: { id: { in: args.ids } },
      });
    },
    recordItemsSold: async (
      _: unknown,
      args: { itemsSold: Prisma.ItemsSoldCreateManyInput[] },
      context: Context,
    ) => {
      return await context.prisma.$transaction(async (prisma) => {
        const recordedItemsSold = await prisma.itemsSold.createMany({
          data: args.itemsSold,
        });

        const updateStockPromises = args.itemsSold.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }),
        );

        await Promise.all(updateStockPromises);

        return recordedItemsSold;
      });
    },
    recordRevenue: async (
      _: unknown,
      args: { revenue: Prisma.RevenueCreateManyInput[] },
      context: Context,
    ) => {
      return await context.prisma.revenue.createMany({
        data: args.revenue,
      });
    },
    recordItemsRestocked: async (
      _: unknown,
      args: { itemsRestocked: Prisma.ItemsRestockedCreateManyInput[] },
      context: Context,
    ) => {
      return await context.prisma.$transaction(async (prisma) => {
        const recordedItemsRestocked = await prisma.itemsRestocked.createMany({
          data: args.itemsRestocked,
        });

        const updateStockPromises = args.itemsRestocked.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          }),
        );

        await Promise.all(updateStockPromises);

        return recordedItemsRestocked;
      });
    },
  },
  Category: {
    products: async (parent: { id: number }, _: unknown, context: Context) => {
      return await context.prisma.product.findMany({
        where: { categoryId: parent.id },
        include: {
          orderItems: true,
          itemsSold: true,
          itemsRestocked: true,
        },
      });
    },
  },
  Product: {
    category: async (
      parent: { categoryId: number },
      _: unknown,
      context: Context,
    ) => {
      return await context.prisma.category.findUnique({
        where: { id: parent.categoryId },
      });
    },
    orderItems: async (
      parent: { id: string },
      _: unknown,
      context: Context,
    ) => {
      return await context.prisma.orderItem.findMany({
        where: { productId: parent.id },
        include: {
          order: true,
        },
      });
    },
    itemsSold: async (parent: { id: string }, _: unknown, context: Context) => {
      return await context.prisma.itemsSold.findMany({
        where: { productId: parent.id },
      });
    },
    itemsRestocked: async (
      parent: { id: string },
      _: unknown,
      context: Context,
    ) => {
      return await context.prisma.itemsRestocked.findMany({
        where: { productId: parent.id },
      });
    },
  },
};
