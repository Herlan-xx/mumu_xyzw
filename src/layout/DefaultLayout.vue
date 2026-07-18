<template>
  <div class="default-layout">
    <!-- 顶部导航 -->
    <nav class="dashboard-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <img src="/icons/xiaoyugan.png" alt="XYZW" class="brand-logo" />
          <div class="brand-toggle" @click="isMobileMenuOpen = true">
            <n-icon>
              <Menu />
            </n-icon>
            <span class="brand-text">XYZW 控制台</span>
          </div>
        </div>

        <div class="nav-menu">
          <router-link
            to="/admin/dashboard"
            class="nav-item"
            active-class="active"
          >
            <n-icon>
              <Home />
            </n-icon>
            <span>首页</span>
          </router-link>
          <router-link
            to="/admin/game-features"
            class="nav-item"
            active-class="active"
          >
            <n-icon>
              <Cube />
            </n-icon>
            <span>游戏功能</span>
          </router-link>
          <router-link to="/tokens" class="nav-item" active-class="active">
            <n-icon>
              <PersonCircle />
            </n-icon>
            <span>Token管理</span>
          </router-link>
          <router-link
            to="/admin/batch-daily-tasks"
            class="nav-item"
            active-class="active"
          >
            <n-icon>
              <Layers />
            </n-icon>
            <span>批量日常</span>
          </router-link>
          <router-link
            to="/admin/message-test"
            class="nav-item"
            active-class="active"
          >
            <n-icon>
              <ChatbubbleEllipsesSharp />
            </n-icon>
            <span>消息测试</span>
          </router-link>
          <router-link to="/admin/legion-war" class="nav-item" active-class="active"  v-if="isNowInLegionWarTime()" >
            <n-icon>
              <LockOpen />
            </n-icon>
            <span>实时盐场</span>
          </router-link>
        </div>

        <div class="nav-user">
          <!-- 主题切换按钮 -->
          <ThemeToggle />

          <n-dropdown :options="userMenuOptions" @select="handleUserAction">
            <div class="user-info">
              <n-avatar
                :src="selectedToken?.avatar || '/icons/xiaoyugan.png'"
                size="medium"
                fallback-src="/icons/xiaoyugan.png"
              />
              <span class="username">{{
                selectedToken?.name || "未选择Token"
              }}</span>
              <n-icon>
                <ChevronDown />
              </n-icon>
            </div>
          </n-dropdown>
        </div>
      </div>
    </nav>
    <n-drawer
      v-model:show="isMobileMenuOpen"
      placement="bottom"
      :height="'auto'"
      :style="{ maxHeight: '70vh' }"
    >
      <div class="drawer-menu">
        <div class="drawer-handle" />
        <p class="drawer-title">更多功能</p>
        <router-link
          to="/admin/dashboard"
          class="drawer-item"
          @click="isMobileMenuOpen = false"
        >
          <n-icon>
            <Home />
          </n-icon>
          <span>首页</span>
        </router-link>
        <router-link
          to="/admin/game-features"
          class="drawer-item"
          @click="isMobileMenuOpen = false"
        >
          <n-icon>
            <Cube />
          </n-icon>
          <span>游戏功能</span>
        </router-link>
        <router-link
          to="/tokens"
          class="drawer-item"
          @click="isMobileMenuOpen = false"
        >
          <n-icon>
            <PersonCircle />
          </n-icon>
          <span>Token管理</span>
        </router-link>
        <router-link
          to="/admin/daily-tasks"
          class="drawer-item"
          @click="isMobileMenuOpen = false"
        >
          <n-icon>
            <Settings />
          </n-icon>
          <span>任务管理</span>
        </router-link>
        <router-link
          to="/admin/batch-daily-tasks"
          class="drawer-item"
          @click="isMobileMenuOpen = false"
        >
          <n-icon>
            <Layers />
          </n-icon>
          <span>批量日常</span>
        </router-link>
        <router-link
          to="/admin/message-test"
          class="drawer-item"
          @click="isMobileMenuOpen = false"
        >
          <n-icon>
            <ChatbubbleEllipsesSharp />
          </n-icon>
          <span>消息测试</span>
        </router-link>
        <router-link
          to="/admin/legion-war"
          class="drawer-item"
          active-class="active"
          v-if="isNowInLegionWarTime()"
          @click="isMobileMenuOpen = false"
        >
          <n-icon>
            <LockOpen />
          </n-icon>
          <span>实时盐场</span>
        </router-link>
        <router-link
          to="/admin/profile"
          class="drawer-item"
          @click="isMobileMenuOpen = false"
        >
          <n-icon>
            <Settings />
          </n-icon>
          <span>个人设置</span>
        </router-link>
      </div>
    </n-drawer>

    <div class="main">
      <router-view />
    </div>

    <!-- 手机底部导航：拇指热区 -->
    <nav class="mobile-bottom-nav" aria-label="主导航">
      <router-link
        to="/admin/dashboard"
        class="bottom-nav-item"
        active-class="active"
      >
        <n-icon size="22"><Home /></n-icon>
        <span>首页</span>
      </router-link>
      <router-link
        to="/admin/game-features"
        class="bottom-nav-item"
        active-class="active"
      >
        <n-icon size="22"><Cube /></n-icon>
        <span>游戏</span>
      </router-link>
      <router-link to="/tokens" class="bottom-nav-item" active-class="active">
        <n-icon size="22"><PersonCircle /></n-icon>
        <span>Token</span>
      </router-link>
      <router-link
        to="/admin/batch-daily-tasks"
        class="bottom-nav-item"
        active-class="active"
      >
        <n-icon size="22"><Layers /></n-icon>
        <span>批量</span>
      </router-link>
      <button
        type="button"
        class="bottom-nav-item"
        @click="isMobileMenuOpen = true"
      >
        <n-icon size="22"><Menu /></n-icon>
        <span>更多</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import {
  useTokenStore,
  selectedToken,
  selectedTokenId,
} from "@/stores/tokenStore";
import ThemeToggle from "@/components/Common/ThemeToggle.vue";
import {
  Home,
  PersonCircle,
  Cube,
  Settings,
  ChevronDown,
  ChatbubbleEllipsesSharp,
  LockClosedSharp,LockOpen,
  Menu,
  Layers,
} from "@vicons/ionicons5";

import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import { isNowInLegionWarTime } from '@/utils/clubBattleUtils'

const tokenStore = useTokenStore();
const router = useRouter();
const message = useMessage();

const isMobileMenuOpen = ref(false);

const userMenuOptions = [
  {
    label: "清除所有Token并退出",
    key: "logout",
  },
];

// 方法
const handleUserAction = async (key) => {
  switch (key) {
    case "logout":
      await tokenStore.clearAllTokens();
      message.success("已清除所有Token");
      router.push("/tokens");
      break;
  }
};
</script>

<style scoped lang="scss">
.default-layout {
  width: 100%;
  max-width: 100%;
  overflow-x: clip;
}

// 导航栏
.dashboard-nav {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  padding: 0 var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.nav-container {
  display: flex;
  align-items: center;
  height: 64px;
  max-width: 1400px;
  margin: 0 auto;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-right: var(--spacing-xl);
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-small);
}

.brand-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.brand-toggle {
  display: none;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--font-size-lg);
}

.brand-toggle .n-icon {
  font-size: inherit;
}

.nav-menu {
  display: flex;
  gap: var(--spacing-md);
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  &.active {
    background: var(--primary-color-light);
    color: var(--primary-color);
  }
}

.nav-user {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: background var(--transition-fast);

  &:hover {
    background: var(--bg-tertiary);
  }
}

.username {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.main {
  width: 100%;
  max-width: 100%;
}

.mobile-bottom-nav {
  display: none;
}

.drawer-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  padding-bottom: calc(var(--spacing-md) + env(safe-area-inset-bottom, 0px));
}

.drawer-handle {
  width: 36px;
  height: 4px;
  border-radius: 999px;
  background: var(--border-medium, #ddd);
  margin: 0 auto 8px;
}

.drawer-title {
  margin: 0 0 4px;
  padding: 0 var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

.drawer-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 12px var(--spacing-md);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  text-decoration: none;
  min-height: 44px;
}

.drawer-item.router-link-active {
  background: var(--primary-color-light);
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .dashboard-nav {
    padding: 0 var(--spacing-sm);
    padding-top: env(safe-area-inset-top, 0px);
  }

  .nav-item span {
    display: none;
  }

  .nav-menu {
    display: none;
  }

  .nav-item {
    padding: var(--spacing-sm);
    flex: 0 0 auto;
  }

  .nav-container {
    height: 52px;
  }

  .brand-logo {
    display: none;
  }

  .brand-toggle {
    display: inline-flex;
  }

  .username {
    display: none;
  }

  .nav-user {
    gap: var(--spacing-xs);
    margin-left: auto;
  }

  .nav-brand {
    margin-right: var(--spacing-sm);
  }

  .main {
    padding: 0;
    padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px));
  }

  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: calc(var(--z-sticky, 100) + 10);
    background: var(--bg-primary);
    border-top: 1px solid var(--border-light);
    padding: 4px 2px calc(4px + env(safe-area-inset-bottom, 0px));
    justify-content: space-around;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
  }

  .bottom-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-height: 48px;
    padding: 4px 2px;
    border: none;
    background: transparent;
    color: var(--text-tertiary);
    text-decoration: none;
    font-size: 11px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &.active {
      color: var(--primary-color);
    }
  }
}

/* 禁用样式：灰化、鼠标禁止、无hover效果 */
.nav-item.disabled {
  background: #cccccc;
  color: #999999;
  cursor: not-allowed; /* 鼠标样式：禁止 */
  pointer-events: none; /* 可选：直接禁用所有鼠标事件（比阻止click更彻底） */
}
</style>
