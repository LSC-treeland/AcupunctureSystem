/// <reference path='../../typings/jquery/jquery.d.ts'/>
/// <reference path='../../typings/angularjs/angular.d.ts'/>
/// <reference path='../../typings/bootstrap/angular-ui-bootstrap.d.ts'/>
var tcm;
(function (tcm) {
    (function (source2excel) {
        var Source2excelController = (function () {
            function Source2excelController($scope, $http, $location, $log, $modal) {
                $scope.viewModel = this;
                this.scope = $scope; // 固定寫法
                this.http = $http;
                this.log = $log;
                this.modal = $modal;

                this.type = true;
                this.condition = true;
                this.feature = true;
                this.option = 'selection';
            }
            Source2excelController.prototype.hideAndAppear = function () {
                var self = this;
                if (self.option == 'Statistic_TheMainTypeMainCondtionMainFeature') {
                    // 加權 證類
                    self.type = false;
                    self.condition = false;
                    self.feature = false;
                } else if (self.option == 'CalculateTheProbabilityOf2ConditionInFuzzySystem') {
                    // 加權 辨證型
                    self.type = true;
                    self.condition = false;
                    self.feature = false;
                } else if (self.option == 'Statistic_Condtion' || self.option == 'Statistic_sixDiagnosisOfType') {
                    // 辨證候
                    self.type = true;
                    self.condition = true;
                    self.feature = false;
                } else if (self.option == 'Statistic_Type_Average') {
                    // 平權 辨證型
                    self.type = true;
                    self.condition = true;
                    self.feature = true;
                } else if (self.option == 'Statistic_Category_Average') {
                    // 平權 辨證類
                    self.type = true;
                    self.condition = true;
                    self.feature = true;
                } else {
                    self.type = true;
                    self.condition = true;
                    self.feature = true;
                }
            };
            return Source2excelController;
        })();
        source2excel.Source2excelController = Source2excelController;
    })(tcm.source2excel || (tcm.source2excel = {}));
    var source2excel = tcm.source2excel;
})(tcm || (tcm = {}));
/// <reference path='../../typings/jquery/jquery.d.ts'/>
/// <reference path='../../typings/bootstrap/bootstrap.d.ts'/>
/// <reference path='../../typings/angularjs/angular.d.ts'/>
/// <reference path='../../typings/bootstrap/angular-ui-bootstrap.d.ts'/>
var tcm;
(function (tcm) {
    (function (_cuisine) {
        var CuisineListController = (function () {
            function CuisineListController($scope, $http, $log, $modal) {
                this.edit_btn_disabled = false;
                this.phy1 = false;
                this.phy2 = false;
                this.phy3 = false;
                this.phy4 = false;
                this.phy5 = false;
                this.phy6 = false;
                this.phy7 = false;
                this.phy8 = false;
                this.phy9 = false;
                this.query_cuisine_display_bar = false;
                this.publish_cuisine_display_bar = false;
                this.physiques = ["平和體質", "氣虛體質", "陽虛體質", "陰虛體質", "痰濕體質", "濕熱體質", "血瘀體質", "氣鬱體質", "特稟體質"];
                this.selected_physiques = {};
                $scope.viewModel = this; // 固定寫法，viewModel 可以自行取名
                this.scope = $scope; // 固定寫法
                this.http = $http; // 固定寫法
                this.log = $log; // 固定寫法
                this.str = "";
                this.phy1 = false;
                this.phy2 = false;
                this.phy3 = false;
                this.phy4 = false;
                this.phy5 = false;
                this.phy6 = false;
                this.phy7 = false;
                this.phy8 = false;
                this.phy9 = false;
                this.cuisines = [];
                this.verifyCuisines = [];
                this.groups = [];
                this.ingredients = [];
                this.committeeReview = [];
                this.input_ingredient = "";
                this.ingredient_name = "";
                this.roleInCuisineChair = $("#roleInCuisineChair").val();
                this.roleInCuisineCommittee = $("#roleInCuisineCommittee").val();
                this.roleInadmin = $("#roleInCuisineadmin").val();
                this.roleInprofessional = $("#roleInprofessional").val();
                this.personId = $("#personId").val();
                this.popoverUser = "No one checked.";
                this.suggest = "";
                this.cuisineOwnership = "public";
                this.current_cuisine_filter = this.cuisine_public_filter;

                var self = this;
                self.medicalCuisine = "allCuisine";
                this.cuisine_public_filter = function (cuisine) {
                    return (cuisine.owner == null || self.roleInadmin == "true" || self.roleInprofessional == "true" || self.roleInCuisineChair == "true" || self.roleInCuisineCommittee == "true");
                };

                this.cuisine_owner_filter = function (cuisine) {
                    return cuisine.owner == self.personId;
                };

                this.current_cuisine = { ingredients: [], name: "", steps: "", physique: "" };

                this.tabs = [
                    { title: "搜尋", template: "template/cuisine-search.jsp" },
                    { title: "新增/編輯食譜", template: "template/cuisine-edit.jsp" }
                ];
                if (this.roleInCuisineChair == "true" || this.roleInCuisineCommittee == "true") {
                    this.tabs.push({ title: "食譜審核", template: "template/cuisine-review.jsp" });
                }
                this.modal = $modal;
                this.fetchGroupList();
                this.fetchPhysiques(this, "personal", "");
            }
            CuisineListController.prototype.add_physique = function (kind) {
                var self = this;

                if (self.str != "" && self.str.match(kind) == null) {
                    self.str += "、" + kind;
                } else if (self.str.match(kind) == null) {
                    self.str += kind;
                } else {
                    self.str = self.str.replace("、" + kind, "");
                    self.str = self.str.replace(kind + "、", "");
                    self.str = self.str.replace(kind, "");
                }
            };

            CuisineListController.prototype.fetchGroupList = function () {
                var self = this;
                this.http.get(window["tcm_context_path"] + "/Group/?json=true", {}).success(function (response) {
                    self.groups = response;
                    self.groups.unshift({ "id": 0, "name": "個人" });
                    self.first_group_option = self.groups[0];
                });
            };

            CuisineListController.prototype.fetchPhysiques = function (self, type, id) {
                this.http.post("physiques.do", { "type": type, "id": id }).success(function (response) {
                    var _self = self;
                    if (response.length == 0) {
                        _self.selected_physiques["平和體質"] = true;
                    }
                    for (var i = 0; i < response.length; i++) {
                        _self.selected_physiques[response[i]] = true;
                    }
                });
            };

            CuisineListController.prototype.onGroupChange = function ($event) {
                var self = this;
                var type;
                if (self.first_group_option.id == 0) {
                    type = "personal";
                } else {
                    type = "group";
                }
                self.fetchPhysiques(self, type, self.first_group_option.id.toString());
            };

            CuisineListController.prototype.add_ingredient = function () {
                var self = this;
                this.http.post("cuisine.do", {
                    type: "join",
                    input: [this.input_ingredient],
                    group_id: self.first_group_option.id
                }).success(function (DataList) {
                    var alreadyAdd = false;
                    for (var i = 0; i < self.ingredients.length; i++) {
                        if (self.ingredients[i].primarykey == DataList.primarykey) {
                            alreadyAdd = true;
                        }
                    }
                    if (alreadyAdd == false) {
                        self.ingredients.push(DataList);
                    }
                    self.input_ingredient = "";
                }).error(function (response) {
                    if (response == "not found") {
                        alert("資料庫中沒有此類食材食譜");
                        self.input_ingredient = "";
                    } else if (response == "not suit") {
                        alert("此食材為禁忌食物");
                        self.input_ingredient = "";
                    }
                });
            };

            CuisineListController.prototype.remove_ingredient = function () {
                var self = this;
                var selectIndex = $("#ingredient > option:selected").index();
                var arrySize = this.ingredients.length;
                if (arrySize > 0) {
                    self.ingredients.splice(selectIndex, 1);
                }
            };

            CuisineListController.prototype.query_cuisine = function () {
                var self = this;
                self.query_cuisine_display_bar = true;
                this.http.post(window["tcm_context_path"] + "/cuisine.do", {
                    "type": "submit",
                    "input": self.ingredients,
                    "typeeat": $('input[name=type]:checked').val(),
                    "group_id": self.first_group_option.id,
                    "ownership": self.cuisineOwnership,
                    "physiques": $.map(self.selected_physiques, function (v, k) {
                        if (self.medicalCuisine == 'medicalCuisne' && v == true) {
                            return k;
                        }
                    })
                }).success(function (DataList) {
                    var medicalCuisne = [];
                    var nonMedicalCuisine = [];
                    var isMedicinalFleg = false;

                    for (var quryCuisne in DataList) {
                        isMedicinalFleg = false;
                        for (var ingredInCuisine in DataList[quryCuisne].ingredients) {
                            if (DataList[quryCuisne].ingredients[ingredInCuisine].chinesemedicinal == "1") {
                                isMedicinalFleg = true;
                            }
                        }
                        if (isMedicinalFleg) {
                            medicalCuisne.push(DataList[quryCuisne]);
                        } else {
                            nonMedicalCuisine.push(DataList[quryCuisne]);
                        }
                    }

                    if (self.medicalCuisine == "allCuisine") {
                        self.cuisines = DataList;
                        self.cuisines.sort(function (a, b) {
                            return a.name > b.name ? 1 : 0;
                        });
                    }

                    if (self.medicalCuisine == "medicalCuisne") {
                        var selected_physiques = $.map(self.selected_physiques, function (v, k) {
                            if (v == true) {
                                return k;
                            }
                        });
                        self.cuisines = medicalCuisne;
                        var is_selected_phy_cuisines = [];
                        var not_selected_phy_cuisines = [];
                        var no_phy_cuisines = [];
                        for (var idx in self.cuisines) {
                            if (self.cuisines[idx].physique == null || self.cuisines[idx].physique == "") {
                                no_phy_cuisines.push(self.cuisines[idx]);
                                continue;
                            }
                            var cuisine_phy = self.cuisines[idx].physique.split("、");
                            var isMatch = false;
                            for (var phy_idx in cuisine_phy) {
                                if ($.inArray(cuisine_phy[phy_idx] + "體質", selected_physiques) >= 0) {
                                    isMatch = true;
                                }
                            }
                            if (isMatch) {
                                is_selected_phy_cuisines.push(self.cuisines[idx]);
                            } else {
                                not_selected_phy_cuisines.push(self.cuisines[idx]);
                            }
                        }
                        is_selected_phy_cuisines.sort(function (a, b) {
                            return a.name > b.name ? 1 : 0;
                        });
                        not_selected_phy_cuisines.sort(function (a, b) {
                            return a.name > b.name ? 1 : 0;
                        });
                        no_phy_cuisines.sort(function (a, b) {
                            return a.name > b.name ? 1 : 0;
                        });

                        self.cuisines = is_selected_phy_cuisines.concat(not_selected_phy_cuisines.concat(no_phy_cuisines));
                    }

                    if (self.medicalCuisine == "nonMedicalCuisine") {
                        self.cuisines = nonMedicalCuisine;
                    }
                    self.query_cuisine_display_bar = false;
                }).error(function (response) {
                    alert("查詢失敗");
                });
            };

            CuisineListController.prototype.add_ingredient_to_new_cuisine = function () {
                var self = this;
                this.http.post(window["tcm_context_path"] + "/cuisine.do", { "type": "new_join", "input": [self.ingredient_name] }).success(function (response) {
                    response["quantity"] = 0;
                    var alreadyAdd = false;
                    if (self.current_cuisine['ingredients'] == null) {
                        self.current_cuisine['ingredients'] = [];
                    }
                    for (var i = 0; i < self.current_cuisine.ingredients.length; i++) {
                        if (self.current_cuisine.ingredients[i].primarykey == response.primarykey) {
                            alreadyAdd = true;
                        }
                    }
                    if (alreadyAdd == false) {
                        self.current_cuisine.ingredients.push(response);
                    }
                }).error(function (response) {
                    if (response == "not found") {
                        self.ingredient_name = "";
                        self.open_new_food__request_modal();
                    }
                });
            };

            CuisineListController.prototype.remove_new_cuisine_ingredient = function (index) {
                var self = this;
                var arrySize = self.current_cuisine.ingredients.length;
                if (arrySize > 0) {
                    self.current_cuisine.ingredients.splice(index, 1);
                }
            };

            CuisineListController.prototype.save_cuisine = function () {
                var self = this;
                self.edit_btn_disabled = true;
                self.current_cuisine.physique = self.str;
                this.http.post(window["tcm_context_path"] + "/cuisine_add.do", this.current_cuisine).success(function (response) {
                    self.edit_btn_disabled = false;
                    self.current_cuisine = response;

                    if (confirm("新增/編輯成功!\n\n" + "是否新增下一筆？")) {
                        self.current_cuisine = {};
                    }
                });
            };

            CuisineListController.prototype.publish_cuisine = function () {
                var self = this;
                self.publish_cuisine_display_bar = true;
                self.edit_btn_disabled = true;
                self.current_cuisine.physique = self.str;
                this.http.post(window["tcm_context_path"] + "/cuisine.do", { "id": self.current_cuisine.id, "type": "publish" }).success(function (response) {
                    self.publish_cuisine_display_bar = false;
                    alert("您的食譜已經送出給食譜審核委員會審核，日後會告知您審核的結果。");
                });
            };

            CuisineListController.prototype.edit_cuisine = function (id) {
                var self = this;
                $.each(this.cuisines, function (idx, cuisine) {
                    if (cuisine.id == id) {
                        self.current_cuisine = cuisine;
                    }
                });
                self.phy1 = false;
                self.phy2 = false;
                self.phy3 = false;
                self.phy4 = false;
                self.phy5 = false;
                self.phy6 = false;
                self.phy7 = false;
                self.phy8 = false;
                self.phy9 = false;
                if (self.current_cuisine.physique != null) {
                    if (self.current_cuisine.physique.match("平和") != null)
                        self.phy1 = true;
                    if (self.current_cuisine.physique.match("氣虛") != null)
                        self.phy2 = true;
                    if (self.current_cuisine.physique.match("陽虛") != null)
                        self.phy3 = true;
                    if (self.current_cuisine.physique.match("陰虛") != null)
                        self.phy4 = true;
                    if (self.current_cuisine.physique.match("痰濕") != null)
                        self.phy5 = true;
                    if (self.current_cuisine.physique.match("濕熱") != null)
                        self.phy6 = true;
                    if (self.current_cuisine.physique.match("血瘀") != null)
                        self.phy7 = true;
                    if (self.current_cuisine.physique.match("氣鬱") != null)
                        self.phy8 = true;
                    if (self.current_cuisine.physique.match("特稟") != null)
                        self.phy9 = true;
                }
            };

            CuisineListController.prototype.remove_cuisine = function (id) {
                var self = this;
                var cuisine_idx = -1;
                $.each(this.cuisines, function (idx, cuisine) {
                    if (cuisine.id == id) {
                        cuisine_idx = idx;
                    }
                });

                if (window.confirm("確定刪除？") == true) {
                    self.http.post(window["tcm_context_path"] + "/cuisine_rmv.do", { 'id': id }).success(function (response) {
                        if (response.match("success") != null) {
                            self.cuisines.splice(cuisine_idx, 1);
                            alert("刪除成功");
                        }
                    });
                }
            };

            CuisineListController.prototype.isEditing = function () {
                return !(this.current_cuisine.id <= 0 || this.current_cuisine.id == null);
            };

            CuisineListController.prototype.Send_Email_For_Ingredient = function (ingredientName) {
                var self = this;
                this.http.post(window["tcm_context_path"] + "/cuisine.do", { "type": "sendEmail", "input": [ingredientName] }).success(function () {
                    $("#modelDiv").append("<br/>");
                    $("#modelDiv").append("<span>已將信件寄出</span>");
                });
            };

            CuisineListController.prototype.query_cuisine_Verification = function (personRole) {
                var self = this;
                this.http.post(window["tcm_context_path"] + "/cuisine.do", {
                    type: "searchUnverifyCuisine",
                    person_role: personRole
                }).success(function (DataList) {
                    self.verifyCuisines = DataList.cuisineReviewTask;
                    self.log.log(self.verifyCuisines);
                }).error(function (response) {
                    alert("搜尋錯誤");
                });
            };

            CuisineListController.prototype.allowverifyCuisines = function (input_cuisine) {
                var self = this;
                var cuisine_idx = -1;
                this.http.post(window["tcm_context_path"] + "/cuisineDispatch.do", {
                    type: "allowCuisine",
                    cuisine: input_cuisine,
                    person: self.personId
                }).success(function (response) {
                    self.verifyCuisines.splice(self.verifyCuisines.indexOf(input_cuisine), 1);
                    alert("審核成功");
                }).error(function (response) {
                    alert("尚未完成審核程序。");
                });
            };

            CuisineListController.prototype.no_allowverifyCuisines = function (input_cuisine) {
                var self = this;
                if (confirm('你真的要不核可嗎?')) {
                    this.http.post(window["tcm_context_path"] + "/cuisineDispatch.do", {
                        type: "no_allowCuisine",
                        cuisine: input_cuisine,
                        person: self.personId
                    }).success(function (response) {
                        self.verifyCuisines.splice(self.verifyCuisines.indexOf(input_cuisine), 1);
                    }).error(function (response) {
                        alert("尚未完成審核程序。");
                    });
                }
            };

            CuisineListController.prototype.open_new_food__request_modal = function () {
                var self = this;
                var modalInstance = this.modal.open({
                    templateUrl: 'template/not-valid-ingredient-modal.jsp',
                    controller: 'tcm.cuisine.NewFoodRequestController',
                    resolve: {
                        ingredientName: function () {
                            return self.ingredient_name;
                        }
                    }
                });

                modalInstance.result.then(function (ingredientName) {
                    self.Send_Email_For_Ingredient(ingredientName);
                }, function () {
                    self.log.info('Modal dismissed at: ' + new Date());
                });
            };

            CuisineListController.prototype.openDispatchModel = function (cuisine) {
                var self = this;
                var cuisine_var = cuisine;
                var modalInstance = self.modal.open({
                    templateUrl: 'template/dispatchCuisine_template.jsp',
                    controller: 'tcm.cuisine.ModalDispatchCtrl',
                    size: 'sm',
                    resolve: {
                        cuisine: function () {
                            return cuisine;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result.account.length > 0) {
                        self.http.post(window["tcm_context_path"] + "/cuisineDispatch.do", {
                            type: "execdispatch",
                            person: result.account,
                            cuisineId: result.cuisine.id
                        }).success(function (response) {
                            if (response.match("success") != null) {
                                alert("已分派");
                            }
                        });
                    }
                });
            };
            CuisineListController.prototype.updateSuggest = function (cuisine) {
                var self = this;
                self.http.post(window["tcm_context_path"] + "/cuisineDispatch.do", {
                    type: "suggest",
                    suggest: self.suggest,
                    cuisineId: cuisine.id
                }).success(function (response) {
                    alert("您已審核完畢");
                    self.verifyCuisines.splice(self.verifyCuisines.indexOf(cuisine), 1);
                }).error(function (response) {
                    alert("尚未完成審核程序。");
                });
            };
            return CuisineListController;
        })();
        _cuisine.CuisineListController = CuisineListController;

        var NewFoodRequestController = (function () {
            function NewFoodRequestController($scope, $modalInstance, ingredientName) {
                this.scope = $scope;
                this.scope.viewModel = this;
                this.modalInstance = $modalInstance;
                this.ingredientName = ingredientName;
            }
            return NewFoodRequestController;
        })();
        _cuisine.NewFoodRequestController = NewFoodRequestController;

        var ModalDispatchCtrl = (function () {
            function ModalDispatchCtrl($scope, $log, $http, $modalInstance, cuisine) {
                this.scope = $scope;
                this.scope.viewModel = this;
                this.http = $http; // 固定寫法
                this.log = $log; // 固定寫法
                this.modalInstance = $modalInstance;
                var self = this;

                self.cuisine = cuisine;
                self.dispatchPerson = [];
                self.account = [];
                self.chooseAccount = [];

                this.http.post(window["tcm_context_path"] + "/cuisineDispatch.do", {
                    type: "showlist",
                    cuisineId: self.cuisine.id
                }).success(function (response) {
                    self.dispatchPerson = response;
                });
            }
            ModalDispatchCtrl.prototype.ok = function () {
                var self = this;
                for (var i = 0; i < self.dispatchPerson.length; i++) {
                    if (self.account[self.dispatchPerson[i].personId] == true) {
                        self.chooseAccount.push(self.dispatchPerson[i]);
                    }
                }
                self.modalInstance.close({ "cuisine": self.cuisine, "account": self.chooseAccount }); // 丟 JSON 物件
            };
            return ModalDispatchCtrl;
        })();
        _cuisine.ModalDispatchCtrl = ModalDispatchCtrl;
    })(tcm.cuisine || (tcm.cuisine = {}));
    var cuisine = tcm.cuisine;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../typings/angularjs/angular.d.ts'/>
    /// <reference path='../../typings/ngtable/ng-table.d.ts'/>
    (function (food) {
        var FoodEditorController = (function () {
            function FoodEditorController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                this.data = [];
                var self = this;

                this.tableParams = new ngTableParams({
                    page: 1,
                    count: 10
                }, {
                    total: self.data.length,
                    getData: function ($defer, params) {
                        self.http.post("FoodEditor.do", params.url()).success(function (response, status) {
                            self.data = response.data;
                            params.total(response.length); //ngtable要求資料量計算幾個頁數
                            self.displayedData = response; //顯示全部資料
                            $defer.resolve(response.data); //ngtable顯示頁面的資料
                        });
                    }
                });
                this.tabs = [
                    { title: "編輯食材", template: "template/foodeditor-edit.jsp" },
                    { title: "新增食材", template: "template/foodeditor-add.jsp" }
                ];
                this.modal = $modal;
            }
            FoodEditorController.prototype.UpdateDate = function (item) {
                var self = this;
                self.http.post("FoodEditor.do", { action: "update", data: item }).success(function (response, status) {
                });
            };

            FoodEditorController.prototype.Remove = function (index, item) {
                var self = this;

                if (confirm('確定為不合法的食材?')) {
                    item.invalid = 1;
                    self.http.post("FoodEditor.do", { action: "toggle_invalid", data: item }).success(function (response, status) {
                    }).error(function () {
                        item.invalid = 0;
                    });
                }
            };

            FoodEditorController.prototype.RevertFood = function (item) {
                var self = this;
                if (confirm('確定為合法的食材?')) {
                    item.invalid = 0;
                    self.http.post("FoodEditor.do", { action: "toggle_invalid", data: item }).success(function (response, status) {
                    }).error(function () {
                        item.invalid = 1;
                    });
                }
            };

            FoodEditorController.prototype.Cancel = function (item) {
                var self = this;
                self.http.post("FoodEditor.do", { action: "cancel", data: item }).success(function (response, status) {
                    item.category = response.category;
                    item.sixfoodtype = response.sixfoodtype;
                    item.type = response.type;
                    item.allergiesfood = response.allergiesfood;
                    item.removalqidepressions = response.removalqidepressions;
                    item.removaldamponessheat = response.removaldamponessheat;
                    item.removalphlegmdampness = response.removalphlegmdampness;
                    item.removalstaticblood = response.removalstaticblood;
                    item.enrichyangqi = response.enrichyangqi;
                    item.enrichyinblood = response.enrichyinblood;
                    item.coldhot = response.coldhot;
                    item.kcal = response.kcal;
                    item.water = response.water;
                    item.protein = response.protein;
                    item.fat = response.fat;
                    item.carbohydrate = response.carbohydrate;
                    item.roughfiber = response.roughfiber;
                    item.fiber = response.fiber;
                    item.gray = response.gray;
                    item.cholesterol = response.cholesterol;
                    item.vitaminsa = response.vitaminsa;
                    item.vitaminse = response.vitaminse;
                    item.vitaminsb1 = response.vitaminsb1;
                    item.vitaminsb2 = response.vitaminsb2;
                    item.smoke = response.smoke;
                    item.vitaminsb6 = response.vitaminsb6;
                    item.vitaminsb12 = response.vitaminsb12;
                    item.vitaminsc = response.vitaminsc;
                    item.na = response.na;
                    item.k = response.k;
                    item.ca = response.ca;
                    item.mg = response.mg;
                    item.p = response.p;
                    item.fe = response.fe;
                    item.zn = response.zn;
                    item.weight = response.weight;
                    item.unit = response.unit;
                    item.vegetarianism = response.vegetarianism;
                    item.chinesemedicinal = response.chinesemedicinal;
                    item.invalid = response.invalid;
                });
            };

            FoodEditorController.prototype.insert = function (item) {
                var self = this;
                self.http.post("FoodEditor.do", { action: "insert", data: item }).success(function (response, status) {
                    alert(response.success_fault);
                });
            };

            FoodEditorController.prototype.reset = function (item) {
                var self = this;
                item.name = null;
                item.category = null;
                item.sixfoodtype = null;
                item.type = null;
                item.allergiesfood = null;
                item.removalqidepressions = null;
                item.removaldamponessheat = null;
                item.removalphlegmdampness = null;
                item.removalstaticblood = null;
                item.enrichyangqi = null;
                item.enrichyinblood = null;
                item.coldhot = null;
                item.kcal = null;
                item.water = null;
                item.protein = null;
                item.fat = null;
                item.carbohydrate = null;
                item.roughfiber = null;
                item.fiber = null;
                item.gray = null;
                item.cholesterol = null;
                item.vitaminsa = null;
                item.vitaminse = null;
                item.vitaminsb1 = null;
                item.vitaminsb2 = null;
                item.smoke = null;
                item.vitaminsb6 = null;
                item.vitaminsb12 = null;
                item.vitaminsc = null;
                item.na = null;
                item.k = null;
                item.ca = null;
                item.mg = null;
                item.p = null;
                item.fe = null;
                item.zn = null;
                item.weight = null;
                item.unit = null;
                item.vegetarianism = null;
                item.chinesemedicinal = null;
            };

            FoodEditorController.prototype.open = function (item) {
                var self = this;
                if (item.category == null) {
                    item.category = "";
                }
                var modalInstance = self.modal.open({
                    templateUrl: 'template/foodeditor-category-edit.jsp',
                    controller: 'tcm.food.ModalCategoryController',
                    resolve: {
                        item: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    item.category = selectedItem;
                });
            };
            return FoodEditorController;
        })();
        food.FoodEditorController = FoodEditorController;

        var ModalCategoryController = (function () {
            function ModalCategoryController($scope, $modalInstance, $http, $log, item) {
                this.items = [];
                this.str = "";
                this.selectd_categorys = {};
                this.cancel = function () {
                    this.modalInstance.dismiss('cancel');
                };
                this.ok = function () {
                    var self = this;
                    for (var i = 0; i < self.items.length; i++) {
                        if (self.selectd_categorys[self.items[i].kind] == true) {
                            self.str += self.items[i].kind + "、";
                        }
                    }
                    self.str = self.str.substring(0, (self.str.length - 1));
                    self.log.log(self.str);
                    this.modalInstance.close(self.str);
                };
                this.clear = function () {
                    var self = this;
                    self.selectd_categorys = {};
                };
                var self = this;
                self.scope = $scope;
                self.scope.viewModel = this;
                self.modalInstance = $modalInstance;
                self.http = $http;
                self.log = $log;
                self.item = item;
                var already_categorys = self.item.category.split("、");
                for (var i = 0; i < already_categorys.length; i++) {
                    self.selectd_categorys[already_categorys[i]] = true;
                }
                self.http.post(window["tcm_context_path"] + "/FoodEditor.do", { action: "kinds" }).success(function (response, status) {
                    self.items = response.data;
                });
            }
            return ModalCategoryController;
        })();
        food.ModalCategoryController = ModalCategoryController;
    })(tcm.food || (tcm.food = {}));
    var food = tcm.food;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../typings/angularjs/angular.d.ts'/>
    (function (admin) {
        var UserMaintainController = (function () {
            function UserMaintainController($scope, $window, ngTableParams, $log, $http) {
                this.data = [];
                this.log = $log;
                this.scope = $scope;
                this.window = $window;
                this.scope.viewModel = this;

                var self = this;
                this.tableParams = new ngTableParams({
                    page: 1,
                    count: 10
                }, {
                    total: self.data.length,
                    getData: function ($defer, params) {
                        $defer.resolve(self.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                $http.post("MaintenanceUser", {}).success(function (data) {
                    $.each(data, function (idx, elem) {
                        $log.log(idx, elem);
                        self.data.push(elem);
                    });
                });
            }
            UserMaintainController.prototype.remove = function (member) {
                if (this.window.confirm("Delete user " + member.name + " ?")) {
                    this.window.location.href = 'MaintenanceUserDelete?checkbox=' + member.id;
                }
            };

            UserMaintainController.prototype.edit = function (member) {
                this.window.location.href = 'editData.do?memberMgn=true&account=' + member.account;
            };
            return UserMaintainController;
        })();
        admin.UserMaintainController = UserMaintainController;
    })(tcm.admin || (tcm.admin = {}));
    var admin = tcm.admin;
})(tcm || (tcm = {}));
/// <reference path='../../typings/jquery/jquery.d.ts'/>
/// <reference path='../../typings/angularjs/angular.d.ts'/>
/// <reference path='../../typings/bootstrap/angular-ui-bootstrap.d.ts'/>
/// <reference path='../../typings/ngtable/ng-table.d.ts'/>
var tcm;
(function (tcm) {
    (function (project) {
        var ProjectController = (function () {
            function ProjectController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                this.projectID = $('#projectID').val();

                this.modal = $modal;
                this.fetchProjectsList();

                this.onProjectChange(this.projectID, 0);
                this.tabs = [
                    { title: "病例", template: "template/Project-add.jsp" },
                    { title: "專業成員", template: "template/Project-edit.jsp" }
                ];
            }
            ProjectController.prototype.fetchProjectsList = function () {
                var self = this;

                // self.log.log(item);
                self.http.post("ProjectManage.do", {
                    action: "fetchProjectList"
                }).success(function (response, status) {
                    if (response.length == 0) {
                        self.projects = [];
                        self.log.log("0" + self.projects);
                        self.first_project_option = null;
                    } else {
                        self.projects = response;
                        self.log.log("1" + self.projects);
                        for (var i in self.projects) {
                            if (self.projects[i].id == self.projectID) {
                                self.first_project_option = self.projects[i];
                            }
                        }
                    }
                });
            };

            ProjectController.prototype.onProjectChange = function (id, flag) {
                var self = this;
                this.fetchPatientsList(id);
                this.fetchResearcherList(id);
                /*
                if (flag) {
                self.http.post("ProjectManage.do", { action: "change_page" })
                .success(function(response: any) {
                this.window.location.href = 'ProjectManage.do';
                });
                }*/
            };

            ProjectController.prototype.addResearcher = function (item) {
                var self = this;
                item.projectId = self.first_project_option.id;
                self.http.post("ProjectManage.do", { action: "insert_researcher", data: item }).success(function (response, status) {
                    if (response.length == 0) {
                        alert(item.researcherAccount + "並非專業使用者或已經在該專案內");
                        this.window.location.href = 'ProjectManage.do';
                    } else {
                        alert("已對" + item.researcherAccount + "送出project邀請");
                        this.window.location.href = 'ProjectManage.do';
                    }
                });
            };

            ProjectController.prototype.addPatient = function (item) {
                var self = this;
                item.projectId = self.first_project_option.id;
                self.http.post("ProjectManage.do", { action: "insert_patient", data: item }).success(function (response, status) {
                    if (response.length == 0) {
                        alert(item.patientName + "已經在該專案內");
                        this.window.location.href = 'ProjectManage.do';
                    } else {
                        alert("已將" + item.patientName + "(先生/小姐)成功加入project");
                        this.window.location.href = 'ProjectManage.do';
                    }
                });
            };
            ProjectController.prototype.fetchPatientsList = function (id) {
                var self = this;
                self.http.post("ProjectManage.do", {
                    action: "fetchPatientsList",
                    data: id
                }).success(function (response) {
                    self.data = response;
                    self.log.log(self.data);
                });
            };
            ProjectController.prototype.fetchResearcherList = function (id) {
                var self = this;
                self.http.post("ProjectManage.do", {
                    action: "fetchResearcherList",
                    data: id
                }).success(function (response) {
                    self.Researcherdata = response;
                });
            };
            ProjectController.prototype.insert = function (item) {
                var self = this;

                // self.log.log(item);
                self.http.post("ProjectCreate.do", { action: "insert_project", data: item }).success(function (response, status) {
                    alert(response.success_fault);
                    this.window.location.href = 'ProjectManage.do';
                });
            };
            ProjectController.prototype.switching = function (id, name) {
                var self = this;

                // self.log.log(name);
                self.http.post("ProjectManage.do", { action: "switching", clientId: id, clientName: name }).success(function (response) {
                    this.window.location.href = 'main.do';
                });
            };
            ProjectController.prototype.removePatient = function (id) {
                var self = this;
                self.http.post("ProjectManage.do", { action: "delete_patient", clientId: id }).success(function (response, status) {
                    alert(response.success_fault);
                    this.window.location.href = 'ProjectManage.do';
                });
            };
            ProjectController.prototype.managerthat = function (id, name) {
                var self = this;
                var newname;
                var newaccount;

                if (newname = prompt("您原本的姓名為" + name + " ，重新輸入您欲更改的名子", name)) {
                    alert("再次確認，輸入的新姓名為：" + newname);
                    //self.log.log(newname);
                } else {
                    alert("取消變更姓名");
                }

                self.http.post("ProjectManage.do", { action: "managerthat", clientId: id, clientName: name, newnamestr: newname, newaccountstr: newaccount }).success(function (response, status) {
                    this.window.location.href = 'ProjectManage.do';
                });
            };

            ProjectController.prototype.managerthat1 = function (id, name, account) {
                var self = this;
                var newname;
                var newaccount;

                if (newaccount = prompt("您原本的帳號為" + account + " ，重新輸入您欲更改的帳號", account)) {
                    alert("再次確認，輸入的新帳號為：" + newaccount);
                    //self.log.log(newaccount);
                } else {
                    alert("取消變更帳號");
                }
                self.http.post("ProjectManage.do", { action: "managerthat1", clientId: id, clientName: name, newnamestr: newname, newaccountstr: newaccount }).success(function (response, status) {
                    this.window.location.href = 'ProjectManage.do';
                });
            };

            ProjectController.prototype.print_questionnaire = function () {
                var self = this;
                self.log.log(this.projectID);
                self.http.post("TransformBCQ.do", { action: "transform", projectID: this.projectID }).success(function (response, status) {
                    // this.window.location.href = 'ProjectManage.do';
                });
            };

            //編輯專案名稱
            ProjectController.prototype.editProjectName = function (name) {
                var self = this;

                //self.log.log("66" + name);
                self.http.post("ProjectManage.do", { action: "editProjectName", newProjectName: name }).success(function (response, status) {
                    this.window.location.href = 'ProjectManage.do';
                });
            };
            return ProjectController;
        })();
        project.ProjectController = ProjectController;
    })(tcm.project || (tcm.project = {}));
    var project = tcm.project;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../../typings/angularjs/angular.d.ts'/>
    /// <reference path='../../../typings/ngtable/ng-table.d.ts'/>
    (function (symptomsSearch) {
        var symptomsSearchController = (function () {
            function symptomsSearchController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                var self = this;
            }
            symptomsSearchController.prototype.searchStandardBtn = function () {
                var self = this;
                var str = self.search_original_symptoms;
                str = jQuery.trim(str).replace(/[\s\r\n]/g, "");
                self.search_original_symptoms = str;
                self.search_original_symptoms_partial = "";
                self.search_standard_symptoms_partial = "";
                var text_new = "";
                var pattern = "";
                var text_new_not_in_db = "";
                if (self.search_original_symptoms.length > 0) {
                    self.bar = true;
                    self.http.post("symptomsSearch.do", { original_symptoms: self.search_original_symptoms, button: "originalToStandard" }).success(function (response, status) {
                        for (var i in response) {
                            for (var j in response[i].modified_Data_list) {
                                if (response[i].modified_Data_list[j].standard_symptoms != "不存在資料庫") {
                                    pattern += response[i].modified_Data_list[j].standard_symptoms + "。";
                                } else {
                                    text_new_not_in_db += response[i].original_symptoms + "。";
                                    pattern += "不存在資料庫。";
                                }
                            }
                            text_new += response[i].original_symptoms + "。\n";
                            pattern += "\n";
                        }
                        self.search_original_symptoms = text_new;
                        self.search_standard_symptoms = pattern;
                        self.search_original_symptoms_partial = text_new_not_in_db;
                        if (self.search_original_symptoms_partial) {
                            self.searchSuggestBtn();
                        } else {
                            self.search_original_symptoms_partial = "";
                            self.search_standard_symptoms_partial = "";
                            self.bar = false;
                        }
                        self.bar = false;
                    }).error(function (response) {
                        self.log.log(response);
                        self.bar = false;
                    });
                } else {
                    alert("請輸入原始症狀。");
                }
            };

            symptomsSearchController.prototype.searchOriginalBtn = function () {
                var self = this;
                var str = self.search_standard_symptoms;
                str = jQuery.trim(str).replace(/[\r\n]/g, "");
                self.search_standard_symptoms = str;
                self.search_original_symptoms_partial = "";
                self.search_standard_symptoms_partial = "";
                var text_new = "";
                var pattern = "";
                if (self.search_standard_symptoms.length > 0) {
                    self.bar = true;
                    self.http.post("symptomsSearch.do", { standard_symptoms: self.search_standard_symptoms, button: "standardToOriginal" }).success(function (response, status) {
                        for (var i in response) {
                            text_new += response[i].standard_symptoms + "。\n";
                            if (response[i].result == "success") {
                                for (var j in response[i].Data_list) {
                                    pattern += response[i].Data_list[j].original_symptoms + "。";
                                }
                            } else if (response[i].result == "fail") {
                                pattern += "不存在資料庫。";
                            }
                            pattern += "\n";
                        }
                        self.search_original_symptoms = pattern;
                        self.search_standard_symptoms = text_new;
                        self.bar = false;
                    }).error(function (response) {
                        self.log.log(response);
                        self.bar = false;
                    });
                } else {
                    alert("請輸入標準症狀。");
                }
            };

            symptomsSearchController.prototype.searchSuggestBtn = function () {
                var self = this;
                self.search_original_symptoms_partial = jQuery.trim(self.search_original_symptoms_partial).replace(/[\r\n]/g, "");
                ;
                var text_new = "";
                var pattern = "";
                if (self.search_original_symptoms_partial) {
                    self.bar = true;
                    self.http.post("symptomsSearch.do", { org_sym_partial: self.search_original_symptoms_partial, button: "suggestStandardSymptoms" }).success(function (response, status) {
                        for (var i in response) {
                            text_new += response[i].original + "。\n";
                            for (var j in response[i].modified_Data_list) {
                                if (response[i].modified_Data_list[j].modified != "不存在資料庫") {
                                    pattern += response[i].modified_Data_list[j] + "。";
                                } else {
                                    pattern += "沒有建議症狀。";
                                }
                            }
                            pattern += "\n";
                        }
                        self.search_original_symptoms_partial = text_new;
                        self.search_standard_symptoms_partial = pattern;
                        self.bar = false;
                        self.WriteToDatabase(); // 存入資料庫
                    }).error(function (response) {
                        self.log.log(response);
                        self.bar = false;
                    });
                }
            };

            symptomsSearchController.prototype.WriteToDatabase = function () {
                var self = this;
                var org_sym_partial = jQuery.trim(self.search_original_symptoms_partial).replace(/[\r\n]/g, "");
                var std_sym_partial = self.search_standard_symptoms_partial;
                std_sym_partial = jQuery.trim(std_sym_partial);
                self.http.post("symptomsSearch.do", { org_sym_partial: org_sym_partial, std_sym_partial: std_sym_partial, button: "WriteToDatabase" }).success(function (response, status) {
                }).error(function (response) {
                    alert("資料庫儲存發生錯誤。");
                    self.log.log(response);
                });
            };
            return symptomsSearchController;
        })();
        symptomsSearch.symptomsSearchController = symptomsSearchController;
    })(tcm.symptomsSearch || (tcm.symptomsSearch = {}));
    var symptomsSearch = tcm.symptomsSearch;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../../typings/angularjs/angular.d.ts'/>
    /// <reference path='../../../typings/ngtable/ng-table.d.ts'/>
    (function (symptomsMaintain) {
        var symptomsMaintainController = (function () {
            function symptomsMaintainController($scope, $http, $location, $log, ngTableParams, $filter) {
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                this.UnConfirmList = [];
                this.SymptomsMappingList = [];
                var self = this;
                self.NotDefine = true;
                self.UnConfirmtableParams = new ngTableParams({
                    action: "FatchUnConfirmData",
                    table: "UnConfirmData",
                    page: 1,
                    count: 10
                }, {
                    total: self.UnConfirmList.length,
                    getData: function ($defer, params) {
                        self.http.post("symptomsMaintain.do", params.url()).success(function (response, status) {
                            self.UnConfirmList = response.data;
                            params.total(response.length); //ngtable要求資料量計算幾個頁數
                            self.AllUnConfirmData = response; //顯示全部資料
                            $defer.resolve(response.data); //ngtable顯示頁面的資料
                        });
                    }
                });

                self.SymptomsMappingtableParams = new ngTableParams({
                    action: "FatchSymptomsMappingData",
                    table: "MappingData",
                    page: 1,
                    count: 10
                }, {
                    total: self.SymptomsMappingList.length,
                    getData: function ($defer, params) {
                        self.http.post("symptomsMaintain.do", params.url()).success(function (response, status) {
                            self.SymptomsMappingList = response.data;
                            params.total(response.length); //ngtable要求資料量計算幾個頁數
                            self.AllSymptomsMappingData = response; //顯示全部資料
                            $defer.resolve(response.data); //ngtable顯示頁面的資料
                        });
                    }
                });

                $scope.$watch("viewModel.NotDefine", function () {
                    return self.clean();
                });
                $scope.$watch("viewModel.first_class", function () {
                    return self.SymptomsClass(self.first_class);
                });
                $scope.$watch("viewModel.sec_class_model", function () {
                    return self.select_sec(self.sec_class_model);
                });
                $scope.$watch("viewModel.third_class_model", function () {
                    return self.select_third(self.third_class_model);
                });
            }
            symptomsMaintainController.prototype.clean = function () {
                var self = this;
                self.sym_maintain_original_text = "";
                self.sym_maintain_standard_text = "";
            };

            symptomsMaintainController.prototype.SymptomsClass = function (item) {
                var self = this;
                if (item != null && item != "") {
                    self.http.post("symptomsMaintain.do", { first_class: item, action: "first_select" }).success(function (response, status) {
                        self.third_class_div = false;
                        self.level2 = response.item;
                        self.list = response.symptoms;
                        self.sec_class_model = self.level2[-1];
                        self.list_model = self.list[-1];
                    }).error(function (response) {
                        self.log.log(response);
                    });
                }
            };

            symptomsMaintainController.prototype.select_sec = function (item) {
                var self = this;
                if (item != null && item.length > 0) {
                    self.http.post("symptomsMaintain.do", { first_class: item, action: "sec_select" }).success(function (response, status) {
                        if (response.item.length != 0) {
                            self.third_class_div = true; // 顯示
                            self.level3 = response.item;
                            self.third_class_model = self.level3[-1];
                        } else {
                            self.third_class_div = false;
                        }
                        self.list = response.symptoms;
                        self.list_model = self.list[-1];
                    }).error(function (response) {
                        self.log.log(response);
                    });
                }
            };

            symptomsMaintainController.prototype.select_third = function (item) {
                var self = this;
                if (item != null && item.length > 0) {
                    self.http.post("symptomsMaintain.do", { first_class: item, action: "third_select" }).success(function (response, status) {
                        self.list = response.item;
                        self.list_model = self.list[-1];
                    }).error(function (response) {
                        self.log.log(response);
                    });
                }
            };

            symptomsMaintainController.prototype.addSymptoms = function (item) {
                var self = this;
                var has_sym = false;
                var standard_sym = self.sym_maintain_standard_text;
                standard_sym = jQuery.trim(standard_sym);
                var sym_split = standard_sym.split("。");
                jQuery.each(sym_split, function (i, val) {
                    if (val == item) {
                        return (has_sym = true);
                    }
                });
                if (!has_sym) {
                    standard_sym = standard_sym + item + "。";
                    self.sym_maintain_standard_text = standard_sym;
                }
            };

            symptomsMaintainController.prototype.symptomsChecked = function (item) {
                var self = this;
                self.sym_maintain_original_text = item.symptom;
                self.sym_maintain_standard_text = item.standard_symptoms;
                $("html, body").animate({ scrollTop: 0 }, "slow");
            };

            symptomsMaintainController.prototype.symptomsMappingChecked = function (item) {
                var self = this;
                self.sym_maintain_original_text = item.original_symptoms;
                self.sym_maintain_standard_text = item.standard_symptoms + "。";
                $("html, body").animate({ scrollTop: 0 }, "slow");
            };

            symptomsMaintainController.prototype.addNewSymptomsMapping = function () {
                var self = this;
                var original_text = self.sym_maintain_original_text;
                original_text = jQuery.trim(original_text).replace(/[\r\n]/g, "");
                var standard_text = self.sym_maintain_standard_text;
                standard_text = jQuery.trim(standard_text).replace(/[\r\n]/g, "");
                var OriginalSize = original_text.split("[.;。]");
                var checked_id = $("input[name='symptomsCheckbx']:checked").attr("id");
                if (original_text.length > 0 && standard_text.length > 0) {
                    if (OriginalSize.length > 1) {
                        alert("原始症狀只能輸入一個。");
                    } else if (confirm("確定要新增嗎?")) {
                        self.http.post("symptomsMaintain.do", { original_text: original_text, standard_text: standard_text, checked_id: checked_id, action: "addNewSymptomsMapping" }).success(function (response, status) {
                            if (response.type == "delete") {
                                for (var i in self.UnConfirmList) {
                                    if (self.UnConfirmList[i].id == Number(checked_id)) {
                                        self.UnConfirmList.splice(i, 1);
                                    }
                                }
                                if (response.conflict) {
                                    alert("新增對應衝突『" + response.conflict + "』已存在資料庫。");
                                } else {
                                    alert("新增成功。");
                                }
                                self.reset();
                            } else if (response.type == "modify") {
                                if (response.standard_symptoms) {
                                    alert("新增對應成功『" + response.standard_symptoms + "』標準症狀。");
                                }
                                if (response.not_standard_symptoms) {
                                    alert("對應失敗，無『" + response.not_standard_symptoms + "』標準症狀，請確認標準症狀。");
                                }
                                self.sym_maintain_standard_text = response.standard_symptoms;
                                for (var i in self.UnConfirmList) {
                                    if (self.UnConfirmList[i].id == Number(checked_id)) {
                                        self.UnConfirmList[i].standard_symptoms = response.standard_symptoms;
                                    }
                                }
                            }
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                } else {
                    alert("請輸入原始症狀和標準症狀。");
                }
            };

            symptomsMaintainController.prototype.ModifiedDatabase = function () {
                var self = this;
                var same = false;
                var checked_id = $("input[name='symptomsMappingsCheckbox']:checked").attr("id");
                var original_text = self.sym_maintain_original_text;
                var standard_text = self.sym_maintain_standard_text;
                standard_text = jQuery.trim(standard_text).replace(/[\r\n]/g, "");
                var StandardSize = standard_text.split("[.;。]");
                if (original_text.length > 0 && standard_text.length > 0) {
                    if (StandardSize.length > 1) {
                        alert("錯誤，只能輸入一種對應的標準症狀。");
                    } else if (confirm("確定要修改嗎?\n")) {
                        self.http.post("symptomsMaintain.do", { checked_id: checked_id, original_text: original_text, standard_text: standard_text, action: "sym_main_ModifiedData" }).success(function (response, status) {
                            if (response == "success") {
                                alert("修改成功");
                                for (var i in self.SymptomsMappingList) {
                                    if (self.SymptomsMappingList[i].id == Number(checked_id)) {
                                        self.SymptomsMappingList[i].original_symptoms = original_text;
                                        self.SymptomsMappingList[i].standard_symptoms = standard_text;
                                    }
                                }
                                self.reset();
                            } else {
                                alert(response);
                            }
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                } else {
                    alert("請由下方的表格點選要修改的資料。");
                }
            };

            symptomsMaintainController.prototype.DeleteUnConfirmDatabase = function () {
                var self = this;
                var same = false;
                var checked_id = $("input[name='symptomsCheckbx']:checked").attr("id");
                var original_text = self.sym_maintain_original_text;
                var standard_text = self.sym_maintain_standard_text;
                for (var i in self.UnConfirmList) {
                    if (self.UnConfirmList[i].id == Number(checked_id)) {
                        if (self.UnConfirmList[i].symptom == original_text && self.UnConfirmList[i].standard_symptoms == standard_text) {
                            same = true;
                        }
                    }
                }
                if (same) {
                    if (confirm("確定要刪除嗎?(此為刪除未定義症狀。)\n")) {
                        self.http.post("symptomsMaintain.do", { checked_id: checked_id, action: "DeleteUnConfirmDatabase" }).success(function (response, status) {
                            if (response == "success") {
                                for (var i in self.UnConfirmList) {
                                    if (self.UnConfirmList[i].id == Number(checked_id)) {
                                        self.UnConfirmList.splice(i, 1);
                                    }
                                }
                                alert("刪除成功");
                                self.reset();
                            } else {
                                alert("刪除失敗");
                            }
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                } else {
                    alert("請由下方的表格點選要刪除的資料並且要一致。");
                }
            };

            symptomsMaintainController.prototype.DeleteSymptomsMappingDatabase = function () {
                var self = this;
                var same = false;
                var checked_id = $("input[name='symptomsMappingsCheckbox']:checked").attr("id");
                var original_text = self.sym_maintain_original_text;
                var standard_text = self.sym_maintain_standard_text;
                for (var i in self.SymptomsMappingList) {
                    if (self.SymptomsMappingList[i].id == Number(checked_id)) {
                        if (self.SymptomsMappingList[i].original_symptoms == original_text && self.SymptomsMappingList[i].standard_symptoms == standard_text) {
                            same = true;
                        }
                    }
                }

                if (same) {
                    if (confirm("確定要刪除嗎?\n(此為刪除已定義症狀。)\n")) {
                        self.http.post("symptomsMaintain.do", { checked_id: checked_id, action: "DeleteSymptomsMappingData" }).success(function (response, status) {
                            if (response == "success") {
                                for (var i in self.SymptomsMappingList) {
                                    if (self.SymptomsMappingList[i].id == Number(checked_id)) {
                                        self.SymptomsMappingList.splice(i, 1);
                                    }
                                }
                                alert("刪除成功");
                                self.reset();
                            } else {
                                alert("資料庫發生錯誤。");
                            }
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                } else {
                    alert("請由下方的表格點選要刪除的資料並且要一致。");
                }
            };

            symptomsMaintainController.prototype.SearchOriginalToStandard = function () {
                var self = this;
                var original_text = self.sym_maintain_original_text;
                original_text = jQuery.trim(original_text).replace(/[\r\n]/g, "");
                var text_new = "";
                var pattern = "";

                if (original_text.length > 0) {
                    self.http.post("symptomsSearch.do", { original_symptoms: original_text, button: "originalToStandard" }).success(function (response, status) {
                        for (var i in response) {
                            for (var j in response[i].modified_Data_list) {
                                if (response[i].modified_Data_list[j].standard_symptoms != "不存在資料庫") {
                                    pattern = pattern + response[i].modified_Data_list[j].standard_symptoms + "。";
                                } else {
                                    pattern = pattern + "不存在資料庫。";
                                }
                            }
                            text_new += response[i].original_symptoms + "。\n";
                            pattern += "\n";
                        }
                        self.sym_maintain_original_text = text_new;
                        self.sym_maintain_standard_text = pattern;
                    }).error(function (response) {
                        self.log.log(response);
                    });
                } else {
                    alert("請輸入原始症狀。");
                }
            };

            symptomsMaintainController.prototype.reset = function () {
                var self = this;
                self.sym_maintain_original_text = "";
                self.sym_maintain_standard_text = "";
            };
            return symptomsMaintainController;
        })();
        symptomsMaintain.symptomsMaintainController = symptomsMaintainController;
    })(tcm.symptomsMaintain || (tcm.symptomsMaintain = {}));
    var symptomsMaintain = tcm.symptomsMaintain;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../../typings/angularjs/angular.d.ts'/>
    /// <reference path='../../../typings/ngtable/ng-table.d.ts'/>
    (function (keywordMaintain) {
        var keywordMaintainController = (function () {
            function keywordMaintainController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                var self = this;
                self.bar = false;
                self.KeywordMappingList = [];

                self.KeywordMappingtableParams = new ngTableParams({
                    action: "FatchKeywordData",
                    page: 1,
                    count: 10
                }, {
                    total: self.KeywordMappingList.length,
                    getData: function ($defer, params) {
                        self.http.post("keywordMaintain.do", params.url()).success(function (response, status) {
                            self.KeywordMappingList = response.data;
                            params.total(response.length); //ngtable要求資料量計算幾個頁數
                            self.AllKeywordMappingData = response; //顯示全部資料
                            $defer.resolve(response.data); //ngtable顯示頁面的資料
                        });
                    }
                });

                $scope.$watch("viewModel.sec_class", function () {
                    return self.SymptomsInd(self.sec_class);
                });
            }
            keywordMaintainController.prototype.SymptomsClass = function (item) {
                var self = this;
                self.http.post("symptomsMaintain.do", { first_class: item, action: "first_select" }).success(function (response, status) {
                    self.level2 = response.item;
                    self.sec_class = self.level2[-1];
                }).error(function (response) {
                    self.log.log(response);
                });
            };

            keywordMaintainController.prototype.SymptomsInd = function (item) {
                var self = this;
                if (item != null && item.length > 0) {
                    self.http.post("symptomsMaintain.do", { first_class: item, action: "third_select" }).success(function (response, status) {
                        self.ind = response.item;
                        self.symptom = self.ind[0];
                    }).error(function (response) {
                        self.log.log(response);
                    });
                }
            };

            keywordMaintainController.prototype.Cancel = function (item) {
                var self = this;
                self.http.post("keywordMaintain.do", { id: item.id, action: "cancel" }).success(function (response, status) {
                    item.id = response[0].id;
                    item.keyword = response[0].keyword;
                    item.standard_keyword = response[0].standard_keyword;
                }).error(function (response) {
                    self.log.log(response);
                });
            };

            keywordMaintainController.prototype.Modified = function (item) {
                var self = this;
                if (confirm('確定要修改嗎?')) {
                    self.http.post("keywordMaintain.do", { id: item.id, keyword: item.keyword, std_keyword: item.standard_keyword, action: "modify" }).success(function (response, status) {
                        if (response == "std_error") {
                            alert("標準關鍵字詞輸入有誤");
                            self.Cancel(item);
                        } else {
                            alert("修改成功");
                        }
                    }).error(function (response) {
                        self.log.log(response);
                    });
                }
            };

            keywordMaintainController.prototype.Remove = function (item) {
                var self = this;
                if (confirm('確定要刪除嗎?')) {
                    self.http.post("keywordMaintain.do", { id: item.id, action: "delete" }).success(function (response, status) {
                        if (response == "success") {
                            self.compare_list.splice(self.compare_list.indexOf(item), 1);
                            alert("刪除成功");
                        } else {
                            alert("刪除失敗");
                        }
                    }).error(function (response) {
                        self.log.log(response);
                    });
                }
            };

            keywordMaintainController.prototype.New_Keyword_symptoms = function () {
                var self = this;
                self.http.post("keywordMaintain.do", { keyword: self.addKeyword, std_keyword: self.addStandard_keyword, action: "Add" }).success(function (response, status) {
                    if (response[0] == "error") {
                        alert("資料庫沒有此標準關鍵字詞。");
                    } else if (response[0] == "HadMappingData") {
                        alert("資料庫已有。");
                    } else {
                        self.addKeyword = "";
                        self.addStandard_keyword = "";
                        alert("新增成功。");
                    }
                }).error(function (response) {
                    self.log.log(response);
                });
            };

            keywordMaintainController.prototype.Synchronous = function () {
                var self = this;
                self.http.post("keywordMaintain.do", { action: "Synchronous" }).success(function (response, status) {
                    if (response == "success") {
                        alert("同步成功。");
                    } else {
                        alert("同步失敗。");
                    }
                }).error(function (response) {
                    self.log.log(response);
                });
            };
            return keywordMaintainController;
        })();
        keywordMaintain.keywordMaintainController = keywordMaintainController;
    })(tcm.keywordMaintain || (tcm.keywordMaintain = {}));
    var keywordMaintain = tcm.keywordMaintain;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../../typings/angularjs/angular.d.ts'/>
    /// <reference path='../../../typings/ngtable/ng-table.d.ts'/>
    (function (symptomsStandardSearch) {
        var symptomsStandardSearchController = (function () {
            function symptomsStandardSearchController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                var self = this;
                self.bar = false;
                self.Englishversion = false;
                $scope.$watch("viewModel.first_class", function () {
                    return self.sel_first_class(self.first_class);
                });
                $scope.$watch("viewModel.second_class", function () {
                    return self.sel_second_class(self.second_class);
                });
                $scope.$watch("viewModel.third_class", function () {
                    return self.sel_third_class(self.third_class);
                });
                $scope.$watch("viewModel.four_class", function () {
                    return self.sel_four_class(self.four_class);
                });
            }
            symptomsStandardSearchController.prototype.check = function () {
                var self = this;
                if (self.Englishversion == false) {
                    self.Englishversion = true;
                } else {
                    self.Englishversion = false;
                }
            };

            symptomsStandardSearchController.prototype.sel_first_class = function (item) {
                var self = this;
                self.second_class = "";
                self.third_class = "";
                self.four_class = "";
                self.five_class = "";
                self.scond_class_div = false;
                self.third_class_div = false;
                self.four_class_div = false;
                self.five_class_div = false;

                if (item != null && item.length > 0) {
                    if (self.first_class == "症狀") {
                        self.http.post("symptomsStandardSearch.do", { action: "get_select_list", class_element: item }).success(function (response, status) {
                            if (response.item.length != 0) {
                                self.scond_class_div = true;
                            } else {
                                self.scond_class_div = false;
                            }
                            self.level2 = response.item;

                            self.second_class = self.level2[-1];
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    } else {
                        self.http.post("symptomsStandardSearch.do", { action: "get_other_list", class_element: item }).success(function (response, status) {
                            if (response.item.length != 0) {
                                self.scond_class_div = true;
                            } else {
                                self.scond_class_div = false;
                            }
                            self.level2 = response.item;
                            self.second_class = self.level2[-1];
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                }
            };

            symptomsStandardSearchController.prototype.sel_second_class = function (item) {
                var self = this;
                self.third_class = "";
                self.four_class = "";
                self.five_class = "";
                self.third_class_div = false;
                self.four_class_div = false;
                self.five_class_div = false;
                if (item != null && item.length > 0) {
                    if (self.first_class == "症狀") {
                        self.http.post("symptomsStandardSearch.do", { action: "get_select_list", class_element: item }).success(function (response, status) {
                            if (response.item.length != 0) {
                                self.third_class_div = true;
                            } else {
                                self.third_class_div = false;
                            }
                            self.four_class_div = false;
                            self.five_class_div = false;
                            self.level3 = response.item;
                            self.third_class = self.level3[-1];
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    } else {
                        self.http.post("symptomsStandardSearch.do", { action: "get_other_list", class_element: item }).success(function (response, status) {
                            if (response.item.length != 0) {
                                self.third_class_div = true;
                            } else {
                                self.third_class_div = false;
                            }
                            self.four_class_div = false;
                            self.five_class_div = false;
                            self.level3 = response.item;
                            self.third_class = self.level3[-1];
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                }
            };

            symptomsStandardSearchController.prototype.sel_third_class = function (item) {
                var self = this;
                self.four_class = "";
                self.five_class = "";
                self.four_class_div = false;
                self.five_class_div = false;
                if (item != null && item.length > 0) {
                    if (self.first_class == "症狀") {
                        self.http.post("symptomsStandardSearch.do", { action: "get_select_list", class_element: item }).success(function (response, status) {
                            if (response.item.length != 0) {
                                self.four_class_div = true;
                            } else {
                                self.four_class_div = false;
                            }
                            self.level4 = response.item;
                            self.four_class = self.level4[-1];
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    } else {
                        self.http.post("symptomsStandardSearch.do", { action: "get_other_list", class_element: item }).success(function (response, status) {
                            if (response.item.length != 0) {
                                self.four_class_div = true;
                            } else {
                                self.four_class_div = false;
                            }
                            self.five_class_div = false;
                            self.level4 = response.item;
                            self.four_class = self.level4[-1];
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                }
            };

            symptomsStandardSearchController.prototype.sel_four_class = function (item) {
                var self = this;
                self.five_class = "";
                self.five_class_div = false;
                if (item != null && item.length > 0) {
                    if (self.first_class == "症狀") {
                        self.http.post("symptomsStandardSearch.do", { action: "get_select_list", class_element: item }).success(function (response, status) {
                            if (response.item.length != 0) {
                                self.five_class_div = true;
                            } else {
                                self.five_class_div = false;
                            }
                            self.level5 = response.item;
                            self.five_class = self.level5[-1];
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    } else {
                        self.http.post("symptomsStandardSearch.do", { action: "get_other_list", class_element: item }).success(function (response, status) {
                            if (response.item.length != 0) {
                                self.five_class_div = true;
                            } else {
                                self.five_class_div = false;
                            }
                            self.level5 = response.item;
                            self.five_class = self.level5[-1];
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                }
            };
            symptomsStandardSearchController.prototype.searchOneSymptom = function () {
                var self = this;
                self.bar = true;
                var ChineseArray = [];

                //英文頁面搜尋
                // if (self.Symptom_model != "" && self.Englishversion == true) {
                //     self.http.post("symptomsSearch.do", {
                //         action: "Englishsearchmapping", original_symptoms: self.Symptom_model
                //     }).success(function(response: string[]) {
                //         ChineseArray = response.split("。");
                //         self.log.log(ChineseArray);
                //         if (ChineseArray != "") {
                //             self.bar = true;
                //             self.http.post("symptomsStandardSearch.do", { action: "searchMultipleSymptoms", EnglishMappingChineseSymptom: ChineseArray }).success(function(response: any, status: any) {
                //                 self.todoList = response;
                //                 self.log.log(response);
                //                 self.bar = false;
                //             }).error(function(response: string) {
                //                 self.bar = false;
                //             });
                //         } else {
                //             self.todoList = null;
                //             self.bar = false;
                //         }
                //     });
                // }
                //中文頁面搜尋
                if (self.Symptom_model != "" && self.Englishversion == false) {
                    if (self.Symptom_model != "") {
                        self.bar = true;
                        self.http.post("symptomsStandardSearch.do", { action: "searchOneSymptoms", Symptoms: self.Symptom_model }).success(function (response, status) {
                            self.todoList = response;
                            self.log.log(response);
                            self.bar = false;
                        }).error(function (response) {
                            self.log.log(response);
                            self.bar = false;
                        });
                    } else {
                        self.todoList = null;
                        self.bar = false;
                    }
                }
            };
            symptomsStandardSearchController.prototype.searchSymptoms = function () {
                var self = this;
                var Symptoms = "";
                self.searchOneSymptom();
                if (self.five_class != null && self.five_class.length > 0) {
                    Symptoms = self.five_class;
                } else if (self.four_class != null && self.four_class.length > 0) {
                    Symptoms = self.four_class;
                } else if (self.third_class != null && self.third_class.length > 0) {
                    Symptoms = self.third_class;
                } else if (self.second_class != null && self.second_class.length > 0) {
                    Symptoms = self.second_class;
                } else if (self.first_class != null && self.first_class.length > 0) {
                    Symptoms = self.first_class;
                }

                self.bar = true;
                if (self.first_class == "症狀") {
                    self.http.post("symptomsStandardSearch.do", { action: "searchSymptoms", Symptoms: Symptoms }).success(function (response, status) {
                        self.todoList = response;
                        self.bar = false;
                    }).error(function (response) {
                        self.log.log(response);
                        self.bar = false;
                    });
                } else {
                    self.http.post("symptomsStandardSearch.do", { action: "searchSymptomsByOther", Symptoms: Symptoms }).success(function (response, status) {
                        self.todoList = response;
                        self.bar = false;
                    }).error(function (response) {
                        self.log.log(response);
                        self.bar = false;
                    });
                }
            };
            return symptomsStandardSearchController;
        })();
        symptomsStandardSearch.symptomsStandardSearchController = symptomsStandardSearchController;
    })(tcm.symptomsStandardSearch || (tcm.symptomsStandardSearch = {}));
    var symptomsStandardSearch = tcm.symptomsStandardSearch;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../../typings/angularjs/angular.d.ts'/>
    /// <reference path='../../../typings/ngtable/ng-table.d.ts'/>
    (function (SPARQLQuerySearch) {
        var SPARQLQuerySearchController = (function () {
            function SPARQLQuerySearchController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                var self = this;
                self.PREFIX = "PREFIX owl: <http://www.w3.org/2002/07/owl#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX uni: <http://www.semanticweb.org/pllab/ontologies/2013/11/untitled-ontology-2#>";
            }
            SPARQLQuerySearchController.prototype.execQuery = function () {
                var self = this;
                self.http.post("SPARQLQuerySearch.do", { PREFIX: self.PREFIX, query: self.query }).success(function (response, status) {
                    self.data = response.data;
                }).error(function (response) {
                    self.log.log(response);
                });
            };
            return SPARQLQuerySearchController;
        })();
        SPARQLQuerySearch.SPARQLQuerySearchController = SPARQLQuerySearchController;
    })(tcm.SPARQLQuerySearch || (tcm.SPARQLQuerySearch = {}));
    var SPARQLQuerySearch = tcm.SPARQLQuerySearch;
})(tcm || (tcm = {}));
/// <reference path='../../../typings/jquery/jquery.d.ts'/>
/// <reference path='../../../typings/angularjs/angular.d.ts'/>
/// <reference path='../../../typings/ngtable/ng-table.d.ts'/>
var tcm;
(function (tcm) {
    (function (SymptomsDialectical) {
        var SymptomsDialecticalController = (function () {
            function SymptomsDialecticalController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                var self = this;
                self.PrimarySymptomValue = 1.0;
                self.SecondarySymptomValue = 0.5;
                self.OptionalSymptomValue = 0.0;
                self.bar = false;
                self.List = [];
                self._selectedItem = {};
                self.keyword_model = "";
                self.CheckSymptomsOfSubClass("望診症狀");
            }
            SymptomsDialecticalController.prototype.SuggestDialectical = function () {
                var self = this;
                var standard_sym = jQuery.trim(self.keyword_model).replace(/[\r\n]/g, "");
                var SymptomsList = standard_sym.split("。");
                for (var i in SymptomsList) {
                    for (var j in SymptomsList) {
                        if (SymptomsList[i] == SymptomsList[j] && i != j) {
                            SymptomsList.splice(j, 1);
                        }
                    }
                }
                self.log.log(SymptomsList);
                self.keyword_model = "";
                for (var i in SymptomsList) {
                    if (SymptomsList[i] != "") {
                        self.keyword_model += SymptomsList[i] + "。";
                    }
                }
                self.bar = true;
                self.http.post("SymptomsDialectical.do", { keyword: self.keyword_model, action: "dialectical", PrimarySymptomValue: self.PrimarySymptomValue, SecondarySymptomValue: self.SecondarySymptomValue, OptionalSymptomValue: self.OptionalSymptomValue }).success(function (response, status) {
                    self.SyndromesList = response;

                    for (var i in self.SyndromesList) {
                        self.SyndromesList[i].StringPrimarySymptoms = "";
                        self.SyndromesList[i].FocusPrimarySymptoms = "";
                        self.SyndromesList[i].PrimarySymptoms.sort(function (a, b) {
                            if (a < b)
                                return -1;
                            if (a > b)
                                return 1;
                            return 0;
                        });
                        for (var j in self.SyndromesList[i].PrimarySymptoms) {
                            var flag = false;
                            for (var k in SymptomsList) {
                                if (self.SyndromesList[i].PrimarySymptoms[j] == SymptomsList[k]) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag) {
                                self.SyndromesList[i].FocusPrimarySymptoms += self.SyndromesList[i].PrimarySymptoms[j] + "。";
                            } else {
                                self.SyndromesList[i].StringPrimarySymptoms += self.SyndromesList[i].PrimarySymptoms[j] + "。";
                            }
                        }
                    }

                    for (var i in self.SyndromesList) {
                        self.SyndromesList[i].StringSecondarySymptoms = "";
                        self.SyndromesList[i].FocusSecondarySymptoms = "";
                        self.SyndromesList[i].SecondarySymptoms.sort(function (a, b) {
                            if (a < b)
                                return -1;
                            if (a > b)
                                return 1;
                            return 0;
                        });
                        for (var j in self.SyndromesList[i].SecondarySymptoms) {
                            var flag = false;
                            for (var k in SymptomsList) {
                                if (self.SyndromesList[i].SecondarySymptoms[j] == SymptomsList[k]) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag) {
                                self.SyndromesList[i].FocusSecondarySymptoms += self.SyndromesList[i].SecondarySymptoms[j] + "。";
                            } else {
                                self.SyndromesList[i].StringSecondarySymptoms += self.SyndromesList[i].SecondarySymptoms[j] + "。";
                            }
                        }
                    }

                    for (var i in self.SyndromesList) {
                        self.SyndromesList[i].StringOptionalSymptoms = "";
                        self.SyndromesList[i].FocusOptionalSymptoms = "";
                        self.SyndromesList[i].OptionalSymptoms.sort(function (a, b) {
                            if (a < b)
                                return -1;
                            if (a > b)
                                return 1;
                            return 0;
                        });
                        for (var j in self.SyndromesList[i].OptionalSymptoms) {
                            var flag = false;
                            for (var k in SymptomsList) {
                                if (self.SyndromesList[i].OptionalSymptoms[j] == SymptomsList[k]) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag) {
                                self.SyndromesList[i].FocusOptionalSymptoms += self.SyndromesList[i].OptionalSymptoms[j] + "。";
                            } else {
                                self.SyndromesList[i].StringOptionalSymptoms += self.SyndromesList[i].OptionalSymptoms[j] + "。";
                            }
                        }
                    }
                    self.bar = false;
                    self.log.log(self.SyndromesList);
                }).error(function (response) {
                    self.log.log(response);
                    self.bar = false;
                });
            };

            SymptomsDialecticalController.prototype.CheckSymptomsOfSubClass = function (ClassName) {
                var self = this;
                if (ClassName == "望診症狀") {
                    self.http.post("SymptomsDialectical.do", { ClassName: ClassName, action: "CheckSymptoms" }).success(function (response, status) {
                        self.ViewClassNameItem = response;
                        self.CheckSymptomsOfSubClass("聞診症狀");
                    });
                } else if (ClassName == "聞診症狀") {
                    self.http.post("SymptomsDialectical.do", { ClassName: ClassName, action: "CheckSymptoms" }).success(function (response, status) {
                        self.SmellingClassNameItem = response;
                        self.CheckSymptomsOfSubClass("問診症狀");
                    });
                } else if (ClassName == "問診症狀") {
                    self.http.post("SymptomsDialectical.do", { ClassName: ClassName, action: "CheckSymptoms" }).success(function (response, status) {
                        self.InquiryClassNameItem = response;
                        self.CheckSymptomsOfSubClass("切診症狀");
                    });
                } else if (ClassName == "切診症狀") {
                    self.http.post("SymptomsDialectical.do", { ClassName: ClassName, action: "CheckSymptoms" }).success(function (response, status) {
                        self.PalpationClassNameItem = response;
                    });
                }
            };

            SymptomsDialecticalController.prototype.arrangement = function () {
                var self = this;
                self.List = [];
                var symptoms = jQuery.trim(self.keyword_model).replace(/[\r\n]/g, "");
                var SymptomsList = symptoms.split("。");
                for (var i in SymptomsList) {
                    for (var j in SymptomsList) {
                        if (SymptomsList[i] == SymptomsList[j] && i != j) {
                            SymptomsList.splice(j, 1);
                        }
                    }
                }
                for (var i in SymptomsList) {
                    self.List.push(SymptomsList[i]);
                }
            };

            SymptomsDialecticalController.prototype.addSymptoms = function (item) {
                var self = this;
                var flag = false;
                var symptoms = "";
                if (self.List.length > 0) {
                    for (var i in self.List) {
                        if (self.List[i] == item) {
                            flag = true;
                            self.List.splice(i, 1);
                            break;
                        }
                    }
                }
                if (!flag) {
                    self.List.push(item);
                }
                for (var i in self.List) {
                    if (self.List[i] != "") {
                        symptoms += self.List[i] + "。";
                    }
                }
                self.keyword_model = symptoms;
            };
            return SymptomsDialecticalController;
        })();
        SymptomsDialectical.SymptomsDialecticalController = SymptomsDialecticalController;
    })(tcm.SymptomsDialectical || (tcm.SymptomsDialectical = {}));
    var SymptomsDialectical = tcm.SymptomsDialectical;
})(tcm || (tcm = {}));
/// <reference path='../../typings/jquery/jquery.d.ts'/>
/// <reference path='../../typings/angularjs/angular.d.ts'/>
var tcm;
(function (tcm) {
    (function (calories) {
        var CaloriesAnalysisController = (function () {
            function CaloriesAnalysisController($scope, $http, $location, $log) {
                var _this = this;
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;

                this.datas = [];
                this.earlist_latest = [];
                $scope.$watch("viewModel.datas", function () {
                    return _this.onUpdate();
                });
                this.fetchData();
            }
            CaloriesAnalysisController.prototype.onUpdate = function () {
                var self = this;
                var latest = {};
                var earlist = {};
                $.each(this.datas, function (idx, elem) {
                    if (!(elem.id in latest)) {
                        latest[elem.id] = elem;
                    } else {
                        var dList = new Date(latest[elem.id].time);
                        var dTarget = new Date(elem.time);
                        if (dTarget > dList) {
                            latest[elem.id] = elem;
                        }
                    }

                    if (!(elem.id in earlist)) {
                        earlist[elem.id] = elem;
                    } else {
                        var dList = new Date(earlist[elem.id].time);
                        var dTarget = new Date(elem.time);
                        if (dTarget < dList) {
                            earlist[elem.id] = elem;
                        }
                    }
                });
                self.earlist_latest.length = 0;
                $.each(earlist, function (idx, elem) {
                    var obj = { "id": earlist[idx].id, "earlist": earlist[idx], "latest": latest[idx], heatRatio: 0 };
                    if (earlist[idx].realHeat != 0) {
                        obj.heatRatio = (earlist[idx].realHeat - latest[idx].realHeat) / earlist[idx].realHeat;
                    }
                    self.earlist_latest.push(obj);
                });
            };

            CaloriesAnalysisController.prototype.fetchData = function () {
                var self = this;
                this.http.post("CaloriesAnalysis.do", {}).success(function (response, status) {
                    self.datas.length = 0;
                    $.each(response, function (idx, item) {
                        return self.datas.push(item);
                    });
                    self.onUpdate();
                });
            };
            return CaloriesAnalysisController;
        })();
        calories.CaloriesAnalysisController = CaloriesAnalysisController;
    })(tcm.calories || (tcm.calories = {}));
    var calories = tcm.calories;
})(tcm || (tcm = {}));
/// <reference path='../../typings/jquery/jquery.d.ts'/>
/// <reference path='../../typings/angularjs/angular.d.ts'/>
var tcm;
(function (tcm) {
    (function (tutorial) {
        

        var CalculatorController = (function () {
            function CalculatorController($scope, $http, $log) {
                $scope.viewModel = this; // 固定寫法，viewModel 可以自行取名
                this.scope = $scope; // 固定寫法
                this.expr = "";
                this.http = $http; // 固定寫法
                this.log = $log; // 固定寫法
            }
            CalculatorController.prototype.plus = function () {
                this.expr += "+";
            };

            CalculatorController.prototype.minus = function () {
                this.expr += "-";
            };

            CalculatorController.prototype.mutiply = function () {
                this.expr += "*";
            };

            CalculatorController.prototype.divide = function () {
                this.expr += "/";
            };

            CalculatorController.prototype.appendDigit = function (digit) {
                this.expr += digit.toString();
            };

            CalculatorController.prototype.eval = function () {
                this.expr = eval(this.expr);
                this.expr = this.expr.toString();
            };

            CalculatorController.prototype.testAjax = function () {
                this.http.post("/tcm/calculator.jsp", { expr: this.expr }).success(function (response) {
                    this.log.log(response);
                });
            };
            return CalculatorController;
        })();
        tutorial.CalculatorController = CalculatorController;
    })(tcm.tutorial || (tcm.tutorial = {}));
    var tutorial = tcm.tutorial;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../typings/angularjs/angular.d.ts'/>
    /// <reference path='../../typings/bootstrap/angular-ui-bootstrap.d.ts'/>
    (function (notify) {
        var NotificationController = (function () {
            function NotificationController($scope, $http, $location, $log, $modal) {
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                this.modal = $modal;
                this.data = [];
                this.count = 0;
                var account = $("#account").val();

                this.fetchData(account);
            }
            NotificationController.prototype.open = function () {
                var self = this;
                var modalInstance = self.modal.open({
                    templateUrl: 'notificationModal.html',
                    controller: tcm.notify.ModalNotificationController,
                    size: '',
                    resolve: {
                        data: function () {
                            return self.data;
                        }
                    }
                });
            };

            NotificationController.prototype.fetchData = function (account) {
                var self = this;
                self.http.post(window["tcm_context_path"] + "/NotificationUser.do", { account: account }).success(function (response, status) {
                    self.data = response.data;
                    self.count = response.count;
                });
            };
            return NotificationController;
        })();
        notify.NotificationController = NotificationController;

        var ModalNotificationController = (function () {
            function ModalNotificationController($scope, $http, $modalInstance, data) {
                $scope.viewModel = this;
                this.http = $http;
                this.modalInstance = $modalInstance;
                this.data = data;
            }
            ModalNotificationController.prototype.accept = function (index, item) {
                var self = this;
                self.http.post(window["tcm_context_path"] + "/NotificationUser.do", { action: "accept", data: item }).success(function (response, status) {
                    self.data.splice(index, 1);
                });
            };

            ModalNotificationController.prototype.cancel = function (index, item) {
                var self = this;
                if (confirm('你真的要取消嗎?')) {
                    self.http.post(window["tcm_context_path"] + "/NotificationUser.do", { action: "cancel", data: item }).success(function (response, status) {
                        self.data.splice(index, 1);
                    });
                }
            };

            ModalNotificationController.prototype.reject = function (index, item) {
                var self = this;
                if (confirm('你真的要拒絕嗎?')) {
                    self.http.post(window["tcm_context_path"] + "/NotificationUser.do", { action: "reject", data: item }).success(function (response, status) {
                        self.data.splice(index, 1);
                    });
                }
            };

            ModalNotificationController.prototype.check = function (index, item) {
                var self = this;
                self.http.post(window["tcm_context_path"] + "/NotificationUser.do", { action: "check", data: item }).success(function (response, status) {
                    self.data.splice(index, 1);
                });
            };

            ModalNotificationController.prototype.close = function () {
                var self = this;
                self.modalInstance.dismiss('cancel');
            };
            return ModalNotificationController;
        })();
        notify.ModalNotificationController = ModalNotificationController;
    })(tcm.notify || (tcm.notify = {}));
    var notify = tcm.notify;
})(tcm || (tcm = {}));
/// <reference path='../../typings/jquery/jquery.d.ts'/>
/// <reference path='../../typings/angularjs/angular.d.ts'/>
/// <reference path='../../typings/bootstrap/angular-ui-bootstrap.d.ts'/>
var tcm;
(function (tcm) {
    (function (symptoms_analysis) {
        var symptoms_analysisController = (function () {
            function symptoms_analysisController($scope, $http, $location, $log, $modal) {
                $scope.viewModel = this;
                this.scope = $scope; // 固定寫法
                this.http = $http;
                this.log = $log;
                this.modal = $modal;

                this.collapseCategory = true;
                this.collapseType = true;
                this.threeTypes = [];
                this.threeConditions = [];

                var self = this;
                $scope.$watch(function () {
                    //                    self.log.log("result", $("#showinputsymptoms").val()) ;
                    return $("#showinputsymptoms").val();
                }, function (newValue) {
                    self.input_str_symptoms = newValue;
                    //                    self.log.log("inputstring" , self.input_str_symptoms) ;
                });
            }
            symptoms_analysisController.prototype.diagnoseSyndrome = function () {
                var self = this;

                this.http.post("../symptomsDiagnosis.do", {
                    "syndromeType": "syndrome",
                    "syndrome": self.syndrome,
                    "input_str_symptoms": self.input_str_symptoms
                }).success(function (response) {
                    if (response.length != 0) {
                        //                    self.log.log("Success", response) ;
                        self.categories = response;
                        for (var i = 0; i < self.categories.categoriesList.length; i++) {
                            self.categories.categoriesList[i].categoryWeight_non_divided = Math.round(self.categories.categoriesList[i].categoryWeight_non_divided * 100) / 100;
                            self.categories.categoriesList[i].categoryWeight_divided = Math.round(self.categories.categoriesList[i].categoryWeight_divided * 100) / 100;
                            self.categories.categoriesList[i].matchSymptom.sort(function (arg1, arg2) {
                                if (arg1.symptomName > arg2.symptomName) {
                                    return 1;
                                } else if (arg1.symptomName < arg2.symptomName) {
                                    self.log.log("return -1");
                                } else {
                                    return 0;
                                }
                            });
                            self.categories.categoriesList[i].noneMatchSymptom.sort(function (arg1, arg2) {
                                if (arg1.symptomName > arg2.symptomName) {
                                    return 1;
                                } else if (arg1.symptomName < arg2.symptomName) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                        }
                        self.log.log("categories", self.categories);
                        self.collapseCategory = false;
                    }
                });
            };

            symptoms_analysisController.prototype.diagnoseCategory = function () {
                var self = this;
                self.log.log("category", self.category);

                this.http.post("../symptomsDiagnosis.do", {
                    "syndromeType": "category",
                    "syndrome": self.syndrome,
                    "category": self.category,
                    "input_str_symptoms": self.input_str_symptoms
                }).success(function (response) {
                    if (response.length != 0) {
                        self.log.log("Success", response);
                        self.types = response;
                        for (var i = 0; i < self.types.typesList.length; i++) {
                            self.types.typesList[i].typeWeight_non_divided = Math.round(self.types.typesList[i].typeWeight_non_divided * 100) / 100;
                            self.types.typesList[i].typeWeight_divided = Math.round(self.types.typesList[i].typeWeight_divided * 100) / 100;
                        }

                        for (var i = 0; i < 3; i++) {
                            self.threeTypes[i] = self.types.typesList[i];
                            self.threeTypes[i].matchSymptom.sort(function (arg1, arg2) {
                                if (arg1.symptomName > arg2.symptomName) {
                                    return 1;
                                } else if (arg1.symptomName < arg2.symptomName) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                            self.threeTypes[i].noneMatchSymptom.sort(function (arg1, arg2) {
                                if (arg1.symptomName > arg2.symptomName) {
                                    return 1;
                                } else if (arg1.symptomName < arg2.symptomName) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                        }

                        self.log.log("threeTypes", self.threeTypes);
                        self.collapseType = false;
                    }
                });
            };

            symptoms_analysisController.prototype.swap = function (a, b) {
                var temp = a;
                a = b;
                b = temp;
            };

            symptoms_analysisController.prototype.diagnoseType = function () {
                var self = this;
                self.log.log("type", self.type);

                this.http.post("../symptomsDiagnosis.do", {
                    "syndromeType": "type",
                    "syndrome": self.syndrome,
                    "type": self.type,
                    "input_str_symptoms": self.input_str_symptoms
                }).success(function (response) {
                    if (response.length != 0) {
                        self.log.log("Success", response);
                        self.conditions = response;

                        for (var i = 0; i < self.conditions.conditionsList.length; i++) {
                            self.conditions.conditionsList[i].conditionWeight_non_divided = Math.round(self.conditions.conditionsList[i].conditionWeight_non_divided * 100) / 100;
                            self.conditions.conditionsList[i].conditionWeight_divided = Math.round(self.conditions.conditionsList[i].conditionWeight_divided * 100) / 100;
                        }

                        for (var i = 0; i < 3; i++) {
                            self.threeConditions[i] = self.conditions.conditionsList[i];
                            self.threeConditions[i].matchSymptom.sort(function (arg1, arg2) {
                                if (arg1.symptomName > arg2.symptomName) {
                                    return 1;
                                } else if (arg1.symptomName < arg2.symptomName) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                            self.threeConditions[i].noneMatchSymptom.sort(function (arg1, arg2) {
                                if (arg1.symptomName > arg2.symptomName) {
                                    return 1;
                                } else if (arg1.symptomName < arg2.symptomName) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                        }

                        self.log.log("threeConditions", self.threeConditions);
                    }
                });
            };

            //----------------------------------------------------------------------------------------------------------------//
            symptoms_analysisController.prototype.open = function (condition) {
                var self = this;
                self.log.log("type11", self.type);
                self.log.log("condition", condition);
                var type = self.type;
                var modalInstance = self.modal.open({
                    templateUrl: 'prescription_modal.jsp',
                    controller: 'tcm.symptoms_analysis.ModalCategoryController',
                    resolve: {
                        type: function () {
                            return type;
                        },
                        condition: function () {
                            return condition;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    //  item.category = selectedItem;
                });
            };
            return symptoms_analysisController;
        })();
        symptoms_analysis.symptoms_analysisController = symptoms_analysisController;

        var ModalCategoryController = (function () {
            /* private item: any;
            private selectd_categorys = {};*/
            function ModalCategoryController($scope, $modalInstance, $http, $log, type, condition, $modal) {
                this.prescriptions = [];
                this.medicinal_material = function (medicinalMaterial) {
                    var self = this;
                    var modalInst = self.modal.open({
                        templateUrl: 'medicinalMaterial_model.jsp',
                        controller: 'tcm.symptoms_analysis.ModalMaterialController',
                        resolve: {
                            medicinalMaterial: function () {
                                return medicinalMaterial;
                            }
                        }
                    });
                    modalInst.result.then(function () {
                        //  item.category = selectedItem;
                    });
                };
                this.cancel = function () {
                    this.modalInstance.dismiss('cancel');
                };
                var self = this;
                self.scope = $scope;
                self.scope.viewModel = this;
                self.modalInstance = $modalInstance;
                self.http = $http;
                self.log = $log;
                self.types = type;
                self.conditions = condition;
                self.progressbar = true;
                self.modal = $modal;

                self.http.post(window["tcm_context_path"] + "/prescription.do", {
                    action: "search_prescription",
                    type: type,
                    condition: condition
                }).success(function (response, status) {
                    self.prescriptions = response;

                    //self.log.log("prescriptions:", self.prescriptions);
                    self.progressbar = false;
                });
            }
            return ModalCategoryController;
        })();
        symptoms_analysis.ModalCategoryController = ModalCategoryController;

        var ModalMaterialController = (function () {
            function ModalMaterialController($scope, $modalInstance, $http, $log, medicinalMaterial) {
                this.MedicinalMaterialInfor = [];
                this.cancel = function () {
                    this.modalInstance.dismiss('cancel');
                };
                var self = this;
                self.scope = $scope;
                self.scope.viewModel = this;
                self.modalInstance = $modalInstance;
                self.http = $http;
                self.log = $log;
                self.medicinalMaterial = medicinalMaterial;
                self.Inforbar = true;

                self.http.post(window["tcm_context_path"] + "/prescription.do", {
                    action: "search_medicinalMaterial",
                    medicinalMaterial: medicinalMaterial
                }).success(function (response, status) {
                    self.MedicinalMaterialInfor = response;

                    //self.log.log("MedicinalMaterialInfor:", self.MedicinalMaterialInfor);
                    self.Inforbar = false;
                });
            }
            return ModalMaterialController;
        })();
        symptoms_analysis.ModalMaterialController = ModalMaterialController;
    })(tcm.symptoms_analysis || (tcm.symptoms_analysis = {}));
    var symptoms_analysis = tcm.symptoms_analysis;
})(tcm || (tcm = {}));
/// <reference path='CaloriesAnalysis.ts'/>
/// <reference path='CalculatorController.ts'/>
/// <reference path='CuisineListController.ts'/>
/// <reference path='Food.ts'/>
/// <reference path='Notify.ts'/>
/// <referebce path='Tcm_source2Excel.ts'>
/// <reference path='MemberMaintainController.ts'/>
/// <reference path='..\symptomsSearch\ts\symptomsMaintain.ts'/>
/// <reference path='..\symptomsSearch\ts\symptomsSearch.ts'/>
/// <reference path='..\symptomsSearch\ts\keywordMaintain.ts'/>
/// <reference path='..\symptomsSearch\ts\symptomsStandardSearch.ts'/>
/// <reference path='..\symptomsSearch\ts\SPARQLQuerySearch.ts'/>
/// <reference path='..\symptomsSearch\ts\SymptomsDialectical.ts'/>
/// <reference path='symptoms_analysis.ts'/>
angular.module('tcm', ['ui.bootstrap', 'ngTable']).factory("isValidatedId", function () {
    return function (id) {
        var tab = "ABCDEFGHJKLMNPQRSTUVXYWZIO";
        var A1 = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3);
        var A2 = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5);
        var Mx = new Array(9, 8, 7, 6, 5, 4, 3, 2, 1, 1);

        if (id.length != 10) {
            window.alert("格式錯誤，正確格式為一個英文字母與九個數字");
            return false;
        }
        var i = tab.indexOf(id.charAt(0));
        if (i == -1) {
            window.alert("格式錯誤，正確格式為一個英文字母與九個數字");
            return false;
        }

        var sum = A1[i] + A2[i] * 9;

        for (var i = 1; i < 10; i++) {
            var v = parseInt(id.charAt(i));
            if (isNaN(v)) {
                window.alert("格式錯誤，正確格式為一個英文字母與九個數字");
                return false;
            }
            sum = sum + v * Mx[i];
        }

        if (sum % 10 != 0) {
            window.alert("身分證字號驗正錯誤");
            return false;
        }
        return true;
    };
}).controller("tcm.source2excel.Source2excelController", tcm.source2excel.Source2excelController).controller("tcm.calories.CaloriesAnalysisController", tcm.calories.CaloriesAnalysisController).controller("tcm.tutorial.CalculatorController", tcm.tutorial.CalculatorController).controller("tcm.food.FoodEditorController", tcm.food.FoodEditorController).controller("tcm.cuisine.CuisineListController", tcm.cuisine.CuisineListController).controller("tcm.notify.NotificationController", tcm.notify.NotificationController).controller("tcm.admin.UserMaintainController", tcm.admin.UserMaintainController).controller("tcm.project.PojectController", tcm.project.ProjectController).controller("tcm.symptomsMaintain.symptomsMaintainController", tcm.symptomsMaintain.symptomsMaintainController).controller("tcm.symptomsSearch.symptomsSearchController", tcm.symptomsSearch.symptomsSearchController).controller("tcm.keywordMaintain.keywordMaintainController", tcm.keywordMaintain.keywordMaintainController).controller("tcm.symptomsStandardSearch.symptomsStandardSearchController", tcm.symptomsStandardSearch.symptomsStandardSearchController).controller("tcm.SPARQLQuerySearch.SPARQLQuerySearchController", tcm.SPARQLQuerySearch.SPARQLQuerySearchController).controller("tcm.SymptomsDialectical.SymptomsDialecticalController", tcm.SymptomsDialectical.SymptomsDialecticalController).controller("tcm.symptoms_analysis.symptoms_analysis", tcm.symptoms_analysis.symptoms_analysisController);
/// <reference path='../../typings/jquery/jquery.d.ts'/>
/// <reference path='../../typings/angularjs/angular.d.ts'/>
/// <reference path='../../typings/bootstrap/angular-ui-bootstrap.d.ts'/>
/// <reference path='../../typings/ngtable/ng-table.d.ts'/>
var tcm;
(function (tcm) {
    (function (purviewManage) {
        var purviewManageController = (function () {
            function purviewManageController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                this.slides = [
                    { image: 'http://placekitten.com/g/200/309', text: "個人資料 ", linkpage: "/editData.do" },
                    { image: 'http://placekitten.com/g/200/304', text: "查詢身體狀態 ", linkpage: "/DiseaseHistory.do" },
                    { image: 'http://placekitten.com/g/200/302', text: "體質評量", linkpage: "/questionnaire.do" },
                    { image: 'http://placekitten.com/g/200/303', text: "運動規劃 ", linkpage: "/sport.do" }
                ];
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                this.modal = $modal;
                this.fetchpurviewList();
            }
            purviewManageController.prototype.insert = function (item) {
                var self = this;
                self.log.log(item);
                self.http.post("PurviewManage.do", { action: "insert", data: item }).success(function (response, status) {
                    alert(response.success_fault);
                    this.window.location.href = 'main.do';
                });
            };
            purviewManageController.prototype.fetchpurviewList = function () {
                var self = this;

                self.http.post("PurviewManage.do", {
                    action: "fetchpurviewList"
                }).success(function (response) {
                    self.purviewtest = response;
                    self.log.log(self.purviewtest);
                    if ((self.purviewtest.length != 0)) {
                        self.purview = response;
                        self.log.log("44");
                    } else {
                        self.log.log("22");
                        self.purview = [{ Username: "", Usersex: "", Useremail: "", Userphone: "", Userlocaton: "", Userjob: "", accountname: "" }];
                        self.log.log(self.purview);
                    }
                });
            };
            purviewManageController.prototype.deletePurview = function (item) {
                var self = this;

                self.http.post("PurviewManage.do", { action: "delete_purview", data: item }).success(function (response, status) {
                    self.purviewtest = null;
                    alert(response.success_fault);
                    this.window.location.href = 'main.do';
                });
            };
            return purviewManageController;
        })();
        purviewManage.purviewManageController = purviewManageController;
    })(tcm.purviewManage || (tcm.purviewManage = {}));
    var purviewManage = tcm.purviewManage;
})(tcm || (tcm = {}));
/// <reference path='../../typings/jquery/jquery.d.ts'/>
/// <reference path='../../typings/angularjs/angular.d.ts'/>
/// <reference path='../../typings/bootstrap/angular-ui-bootstrap.d.ts'/>
/// <reference path='../../typings/ngtable/ng-table.d.ts'/>
var tcm;
(function (tcm) {
    (function (PublicVersion) {
        var blockIndex = 1;

        var Block = (function () {
            function Block(qType, numofOpts) {
                this.name = "請輸入問題類型";
                this.index = blockIndex++;
                this.questionType = qType;
                this.numOfOptions = numofOpts;
                this.questions = [];
                this.isClear = true;
            }
            Block.prototype.clearQueTitle = function () {
                if (this.isClear && this.name == "請輸入問題類型") {
                    this.name = "";
                    this.isClear = false;
                }
            };
            Block.prototype.reQueTitle = function () {
                if (this.name == "") {
                    this.name = "請輸入問題類型";
                    this.isClear = true;
                }
            };

            Block.prototype.newQuestion = function () {
                this.questions.push(new Question(this.numOfOptions));
                var self = this;

                for (var i = 0; i < this.questions.length; i++) {
                    if (this.questions[i].options.length > this.numOfOptions) {
                        this.questions[i].options.length = this.numOfOptions;
                        this.questions[i].optionNumber.length = this.numOfOptions;
                    } else {
                        var offset = this.numOfOptions - this.questions[i].options.length;
                        for (var j = 0; j < offset; j++) {
                            this.questions[i].options.push(new Option());
                            this.questions[i].optionNumber.push(new OptionNumber());
                        }
                    }
                }
            };
            return Block;
        })();
        PublicVersion.Block = Block;

        var Question = (function () {
            function Question(numofOpts) {
                this.options = [];
                this.optionNumber = [];
                for (var i = 0; i < numofOpts; i++) {
                    this.options.push(new Option());
                    this.optionNumber.push(new OptionNumber());
                }
            }
            return Question;
        })();
        PublicVersion.Question = Question;

        var Option = (function () {
            function Option() {
            }
            return Option;
        })();
        PublicVersion.Option = Option;
        var OptionNumber = (function () {
            function OptionNumber() {
            }
            return OptionNumber;
        })();
        PublicVersion.OptionNumber = OptionNumber;

        var searchdata = (function () {
            function searchdata(data) {
                this.dataId = data.dataId;
                this.iscom = data.iscom;
                this.ispub = data.ispub;
                this.name = data.name;
                this.maker = data.maker;
                if (this.iscom == "未完成") {
                    this.color = "danger";
                } else if (this.ispub == "未公開") {
                    this.color = "warning";
                } else if (this.ispub == "已公開") {
                    this.color = "success";
                } else if (this.ispub == "審核中") {
                    this.color = "info";
                }
            }
            searchdata.prototype.modifydata = function () {
                $("#dataId").attr("value", this.dataId);
                $("#modify").submit();
            };
            return searchdata;
        })();
        PublicVersion.searchdata = searchdata;

        var PublicVersionController = (function () {
            function PublicVersionController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                this.PublicVersionSelect = ["radio", "text"];
                $scope.viewModel = this;
                var self = this;
                this.http = $http;
                this.log = $log;
                this.condition = [];
                this.blocks = [];
                this.ime = [];

                if ($('#PublicBlock').attr("PublicBlock") != null) {
                    this.select($('#PublicBlock').attr("PublicBlock"));
                } else if ($('#ShowPublicVersion').attr("ShowPublicVersion") != null) {
                    this.showPublicVersion($('#ShowPublicVersion').attr("ShowPublicVersion"));
                } else {
                    this.blocks = [new Block(this.PublicVersionSelect[0], 1)];
                }
                self.log.log("7771" + this.PublicBlock);
                if (this.PublicBlock != null) {
                    this.blocks = this.PublicBlock;
                }

                /*if (this.blocks == []) {
                this.blocks = [];
                }*/
                this.status = [{
                        isFirstOpen: true,
                        isFirstDisabled: false
                    }];
                this.iscomplete = "-1";
                this.ispublic = "-1";
                this.searchname = "";
            }
            PublicVersionController.prototype.newBlock = function () {
                this.blocks.push(new Block("radio", 1));
            };
            PublicVersionController.prototype.insert = function (data) {
                var self = this;
                self.allData.push(data);

                self.log.log("76" + data);
                // self.log.log("78888886" + data[3]);
                // self.log.log(data);
                //self.log.log(self.allData);
                // self.log.log(blocks);
            };
            PublicVersionController.prototype.save = function () {
                var self = this;
                this.infor = [{
                        tableName: self.newItem, versioncomplete: "1", tableText: self.newMessage
                    }];
                this.inforCalculate = [{
                        Calculate: self.Calculate
                    }];
                self.blocks.push(self.infor);
                self.blocks.push(self.inforCalculate);

                // self.log.log(data);
                self.log.log(self.blocks);
                self.log.log(self.blocks[1]);
                self.http.post("PublicVersion.do", { action: "save_version", data: self.blocks }).success(function (response, status) {
                    // alert(response.success_fault);
                    this.window.location.href = 'PublicVersionManage.do';
                });
            };
            PublicVersionController.prototype.temporarily = function () {
                var self = this;
                this.infor = [{
                        tableName: self.newItem, versioncomplete: "0"
                    }];
                self.blocks.push(self.infor);

                // self.log.log(data);
                self.log.log(self.blocks);
                self.log.log(self.blocks[1]);
                self.http.post("PublicVersion.do", { action: "save_version", data: self.blocks }).success(function (response, status) {
                    // alert(response.success_fault);
                    this.window.location.href = 'main.do';
                });
            };

            PublicVersionController.prototype.search = function () {
                var self = this;
                self.searchdatas = [];
                self.http.post("PublicVersion.do", { action: "search", searchname: self.searchname, iscomplete: self.iscomplete, ispublic: self.ispublic }).success(function (response) {
                    var i;
                    for (i = 0; i < response.length; i++) {
                        self.searchdatas.push(new searchdata(response[i]));
                    }
                    //self.searchdatas = response;
                });
            };

            PublicVersionController.prototype.select = function (data) {
                var self = this;
                var y = 0;
                self.http.post("PublicVersion.do", {
                    action: "select_version", data: data
                }).success(function (response, status) {
                    self.infor = response;

                    for (var i = 2; i < self.infor.length; i++) {
                        self.blocks[y] = self.infor[y];

                        y++;
                        // self.log.log("blocks112" + self.blocks[1]["versioncomplete"]);
                    }

                    // self.//log.log("--++" + self.blocks[0]["numOfOptions"]);
                    //self.log.log("var" + i);
                    self.newItem = self.infor[y][0]["tableName"];
                    self.newMessage = self.infor[y][0]["tableText"];
                    y++;
                    self.Calculate = self.infor[y][0]["Calculate"];

                    //self.log.log("tableName" + self.infor[y][0]["tableName"]);
                    self.log.log("block.length:" + self.blocks.length);
                    self.log.log("block.inf" + self.blocks);
                    self.log.log(self.blocks[0].questions);
                    self.log.log("blk:" + self.blocks[0].questions.length);
                    self.log.log("block:" + self.blocks[0].questions[0].options.length);

                    for (var k = 0; k < self.blocks.length; k++) {
                        for (var i = 0; i < self.blocks[k].questions.length; i++) {
                            for (var j = 0; j < self.blocks[k].questions[0].options.length; j++) {
                                self.blocks[k].questions[i].options[j].id = "A" + k + i + j;
                                self.blocks[k].questions[i].options[j].name = "A" + k + i;
                                self.log.log("I:" + i + "J:" + j);
                            }
                        }
                    }
                });
                //this.window.location.href = 'PublicVersion.do';
            };

            PublicVersionController.prototype.selectstart = function (data) {
                var self = this;
                self.blocks.push(self.condition);
                self.log.log(data);
                self.http.post("PublicVersion.do", {
                    action: "setattribute", data: data
                }).success(function (response, status) {
                    this.window.location.href = 'PublicVersion.do';
                    // self.blocks = response;
                    // self.log.log("--" + self.blocks);
                    //this.window.location.href = 'PublicVersion.do';
                });
                //this.window.location.href = 'PublicVersion.do';
            };

            PublicVersionController.prototype.cancelcheck = function (data) {
                var self = this;
                self.http.post("PublicVersion.do", {
                    action: "cancelcheck", data: data.dataId, name: data.name
                }).success(function (response) {
                    self.search();
                }).error(function (response) {
                    alert("功能錯誤");
                });
            };

            PublicVersionController.prototype.sendcheck = function (data) {
                var self = this;
                self.http.post("PublicVersion.do", {
                    action: "sendcheck", data: data.dataId, name: data.name
                }).success(function (response) {
                    self.search();
                }).error(function (response) {
                    alert("功能錯誤");
                });
            };

            PublicVersionController.prototype.checkresult = function (data, result) {
                var self = this;
                self.http.post("PublicVersion.do", {
                    action: "checkresult", data: data.dataId, check: result, name: data.name, maker: data.maker
                }).success(function (response) {
                    self.search();
                }).error(function (response) {
                    alert("功能錯誤");
                });
            };

            PublicVersionController.prototype.send = function () {
                var self = this;
                self.log.log("ID:" + $('#PublicBlock').attr("PublicBlock"));
                this.infor = [{
                        tableName: self.newItem, versioncomplete: "1"
                    }];
                this.inforCalculate = [{
                        Calculate: self.Calculate
                    }];
                self.blocks.push(self.infor);
                self.blocks.push(self.inforCalculate);
                self.http.post("UsePublicVersion.do", {
                    action: "send",
                    data: self.blocks,
                    id: $('#PublicBlock').attr("PublicBlock")
                }).success(function (response, status) {
                    alert("已送出!");
                    this.window.location.href = 'UsePublicVersion.do';
                });
            };

            PublicVersionController.prototype.showPublicVersion = function (data) {
                var self = this;
                var y = 0;

                self.http.post("PublicVersion.do", {
                    action: "show", data: data
                }).success(function (response, status) {
                    self.infor = response;

                    for (var i = 2; i < self.infor.length; i++) {
                        self.blocks[y] = self.infor[y];

                        y++;
                        // self.log.log("blocks112" + self.blocks[1]["versioncomplete"]);
                    }

                    // self.//log.log("--++" + self.blocks[0]["numOfOptions"]);
                    //self.log.log("var" + i);
                    self.newItem = self.infor[y][0]["tableName"];
                    y++;
                    self.Calculate = self.infor[y][0]["Calculate"];

                    //self.log.log("tableName" + self.infor[y][0]["tableName"]);
                    self.log.log("block.length:" + self.blocks.length);
                    self.log.log("block.inf" + self.blocks);
                    self.log.log(self.blocks[0].questions);
                    self.log.log("blk:" + self.blocks[0].questions.length);
                    self.log.log("block:" + self.blocks[0].questions[0].options.length);

                    for (var k = 0; k < self.blocks.length; k++) {
                        for (var i = 0; i < self.blocks[k].questions.length; i++) {
                            for (var j = 0; j < self.blocks[k].questions[0].options.length; j++) {
                                self.blocks[k].questions[i].options[j].id = "A" + k + i + j;
                                self.blocks[k].questions[i].options[j].name = "A" + k + i;
                                self.log.log("I:" + i + "J:" + j);
                            }
                        }
                    }
                });
                //this.window.location.href = 'PublicVersion.do';
            };

            PublicVersionController.prototype.delete = function (data) {
                var self = this;
                self.log.log("WWWWW1234567");

                self.http.post("PublicVersion.do", {
                    action: "delete", data: data
                }).success(function (response, status) {
                    this.window.location.href = 'UsePublicVersionHistory.do';
                });
            };

            PublicVersionController.prototype.delpublic = function (data) {
                var self = this;
                self.http.post("PublicVersion.do", {
                    action: "delpublic", data: data
                }).success(function (response, status) {
                    this.window.location.href = 'PublicVersionManage.do';
                    // self.blocks = response;
                    // self.log.log("--" + self.blocks);
                    //this.window.location.href = 'PublicVersion.do';
                });
            };

            PublicVersionController.prototype.range = function (n) {
                return new Array(n);
            };
            return PublicVersionController;
        })();
        PublicVersion.PublicVersionController = PublicVersionController;
    })(tcm.PublicVersion || (tcm.PublicVersion = {}));
    var PublicVersion = tcm.PublicVersion;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    (function (usePublicVersion) {
        var pageIndex = 0;
        var blockIndex = 1;

        var searchdata = (function () {
            function searchdata(data) {
                this.dataId = data.dataId;
                this.name = data.name;
                this.maker = data.maker;
                this.color = "success";
                this.account = data.account;
                this.time = data.time;
            }
            searchdata.prototype.modifydata = function () {
                $("#dataId").attr("value", this.dataId);
                $("#modify").submit();
            };
            return searchdata;
        })();
        usePublicVersion.searchdata = searchdata;

        var searchdatalist = (function () {
            function searchdatalist(data) {
                this.id = data.id;
                this.publicversion_usehistory = data.publicversion_usehistory;
                this.clientaccount = data.clientaccount;
                this.date = data.date;
                this.data = data.data;
            }
            return searchdatalist;
        })();
        usePublicVersion.searchdatalist = searchdatalist;

        var choosetable = (function () {
            function choosetable(data) {
                this.id = data.id;
            }
            return choosetable;
        })();
        usePublicVersion.choosetable = choosetable;

        var UsePublicVersionController = (function () {
            function UsePublicVersionController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                this.PublicVersionSelect = ["radio", "text"];
                $scope.viewModel = this;
                var self = this;
                this.http = $http;
                this.log = $log;
                this.condition = [];
                this.blocks = [];
                this.choosetables = [];
                this.tabletime = [];
                this.tableacc = [];
                this.getaccc = [];
                this.checkcount = 0;
                this.checktimecount = 0;
                this.checkacccount = 0;

                self.searchdatas = [];
                if ($('#RecordBlock').attr("RecordBlock") != null) {
                    this.getRecord($('#RecordBlock').attr("RecordBlock"));
                }
                this.search();
            }
            UsePublicVersionController.prototype.use = function (data) {
                var self = this;
                self.blocks.push(self.condition);
                self.log.log(data);
                self.http.post("UsePublicVersion.do", {
                    action: "use", data: data
                }).success(function (response, status) {
                    this.window.location.href = 'UseScale.do';
                });
            };

            UsePublicVersionController.prototype.search = function () {
                var self = this;
                self.searchdatas = [];

                self.http.post("UsePublicVersion.do", { action: "search" }).success(function (response) {
                    var i;
                    for (i = 0; i < response.length; i++) {
                        self.searchdatas.push(new searchdata(response[i]));
                    }
                    //self.searchdatas = response;
                });
            };

            UsePublicVersionController.prototype.record = function (data) {
                var self = this;
                var a = $("#startdate").val();
                self.searchdatalists = [];

                //self.log.log("record btn.");
                //self.log.log(data);
                self.http.post("UsePublicVersion.do", { action: "record", data: data, a: a }).success(function (response) {
                    this.window.location.href = 'UsePublicVersionHistory.do';
                    //          var i;
                    //          for (i = 0; i < response.length; i++) {
                    //              self.searchdatalists.push(new searchdatalist(response[i]));
                    //         }
                    //         self.log.log(self.searchdatalists);
                    //         this.window.location.href = 'UsePublicVersionHistory.do';
                    //     }
                    //self.searchdatas = response;
                });
            };

            UsePublicVersionController.prototype.delete = function (data) {
                var self = this;
                self.searchdatalists = [];
                self.log.log("delete");
                self.log.log("delete111");
                self.log.log(data);
                self.http.post("UsePublicVersion.do", { action: "delete", data: data }).success(function (response) {
                    self.log.log("finish");
                    this.window.location.href = 'UsePublicVersion.do';
                });
            };

            UsePublicVersionController.prototype.getRecord = function (data) {
                var self = this;
                self.searchdatalists = [];
                self.log.log("Get record.");
                self.log.log(data);
                if ($('#RecordBlock').attr("RecordBlock") != null) {
                    var RecordBlock = $('#RecordBlock').attr("RecordBlock");
                }
                self.log.log(RecordBlock);
                self.http.post("UsePublicVersionHistory.do", { action: "getRecord", data: data }).success(function (response) {
                    var i;
                    for (i = 0; i < response.length; i++) {
                        self.searchdatalists.push(new searchdatalist(response[i]));
                    }
                    self.log.log(self.searchdatalists);
                });
            };

            //test
            UsePublicVersionController.prototype.checktable = function (data, datatime, dataacc) {
                var self = this;
                var i;
                var ii = 0, checkall = 0;

                self.log.log("start");
                self.log.log(data);
                self.log.log(datatime);
                self.log.log(dataacc);

                if (self.tableacc.length == 0) {
                    self.tableacc.push(dataacc);
                    self.choosetables.push(data);
                    self.tabletime.push(datatime);
                    checkall = 1;
                } else {
                    for (ii = 0; ii < self.choosetables.length; ii++) {
                        if (self.tableacc[ii] == dataacc && self.choosetables[ii] == data && self.tabletime[ii] == datatime) {
                            self.log.log("all match");
                            checkall = 1;
                        }
                    }
                }

                if (checkall == 0) {
                    self.tableacc.push(dataacc);
                    self.choosetables.push(data);
                    self.tabletime.push(datatime);
                }
                self.log.log(self.choosetables);
                self.log.log(self.tabletime);
                self.log.log(self.tableacc);

                self.log.log(self.choosetables.toString());
                self.log.log(self.tabletime.toString());
                self.log.log(self.tableacc.toString());
                /*
                if (self.choosetables.length == 0) {
                if (data != self.choosetables[0])
                self.choosetables.push(data);
                }
                else {
                for (i = 0; i <= self.choosetables.length - 1; i++) {
                if (self.choosetables[i] != data) {
                self.checkcount = 1;
                }
                else {
                self.checkcount = 0;
                self.choosetables.splice(i, 1);
                console.log("table.length~~");
                console.log(self.choosetables.length);
                break;
                }
                }
                }
                if (self.checkcount == 1) self.choosetables.push(data);
                self.log.log("tableid=" + self.choosetables);
                self.log.log("table length=" + self.choosetables.length);
                self.log.log("END~");
                
                //-------------------time
                if (self.tabletime.length == 0) {
                if (data != self.tabletime[0])
                self.tabletime.push(datatime);
                }
                else {
                for (i = 0; i <= self.tabletime.length - 1; i++) {
                if (self.tabletime[i] != datatime) {
                self.tabletime = 1;
                }
                else {
                self.checktimecount = 0;
                self.tabletime.splice(i, 1);
                console.log("ttimelength=");
                console.log(self.tabletime.length);
                break;
                }
                }
                }
                if (self.checktimecount == 1) self.tabletime.push(datatime);
                self.log.log("new time=" + self.tabletime);
                self.log.log("timelength=" + self.tabletime.length);
                self.log.log("END~");
                
                //-------------------name
                if (self.tableacc.length == 0) {
                if (data != self.tableacc[0])
                self.tableacc.push(dataacc);
                }
                else {
                for (i = 0; i <= self.tableacc.length - 1; i++) {
                if (self.tableacc[i] != dataacc) {
                self.tableacc = 1;
                }
                else {
                self.checkacccount = 0;
                self.tableacc.splice(i, 1);
                console.log("aaccclength=");
                console.log(self.tableacc.length);
                break;
                }
                }
                }
                if (self.checkacccount == 1) self.tableacc.push(dataacc);
                self.log.log("new acc=" + self.tableacc);
                self.log.log("acclength=" + self.tableacc.length);
                self.log.log("END~");
                */
            };
            UsePublicVersionController.prototype.exporttables = function () {
                var self = this;
                self.log.log("hello~~~~inexporttables");
                self.log.log(self.choosetables);
                self.log.log(self.tabletime);
                self.log.log(self.tableacc);
                self.log.log("part2");
                self.log.log(self.choosetables.toString());
                self.log.log(self.tabletime.toString());
                self.log.log(self.tableacc.toString());

                var da1 = self.choosetables.toString();
                var da2 = self.tabletime.toString();
                var da3 = self.tableacc.toString();
                self.log.log("aavvcc" + da1);

                //System.out.println(self.tableacc.replaceAll("[]", "###"));
                //self.log.log(data);
                self.http.post("ExportTables.do", {
                    action: "gettables", data: da1, data1: da2,
                    data2: da3, data3: self.getaccc
                }).success(function (response) {
                    this.window.location.href = 'ExportTables.do';
                });
            };

            //end~~~~~~~~
            UsePublicVersionController.prototype.showPublicVersion = function (data) {
                var self = this;
                self.blocks.push(self.condition);
                self.log.log(data);
                self.log.log("123");
                self.http.post("UsePublicVersion.do", {
                    action: "show", data: data
                }).success(function (response, status) {
                    this.window.location.href = 'ShowPublicVersion.do';
                });
            };

            UsePublicVersionController.prototype.time = function (index) {
                var self = this;
                self.tabletime.length = 0;
                self.choosetables.length = 0;
                self.tableacc.length = 0;
                self.checkcount = 0;
                self.checktimecount = 0;
                self.checkacccount = 0;

                //console.log("清空後"); console.log(self.choosetables);
                //console.log(self.choosetables.length);
                pageIndex = index;
                var totalNum;
                var totalPage;

                self.searchdatas = [];
                var a = $("#startdate").val();
                self.log.log("start time:" + a);
                self.log.log("starttimeindex" + index);

                if (!a) {
                    alert("請輸入要查詢量表的時間!!");
                } else {
                    self.http.post("ViewAllTable.do", {
                        action: "searchtime", data: a, index: index
                    }).success(function (response) {
                        //console.log("查到的資料筆數 = " + response.length);
                        if (response.length > 0) {
                            var i;
                            for (i = 0; i < response.length - 1; i++) {
                                self.searchdatas.push(new searchdata(response[i]));
                            }
                            totalNum = new searchdata(response[response.length - 1]).dataId;
                            totalPage = Math.ceil(totalNum / 10);
                            if (index + 1 == totalPage) {
                                $("#nextPage").hide();
                            } else {
                                $("#nextPage").show();
                            }
                            if (index == 0) {
                                $("#prePage").hide();
                            } else {
                                $("#prePage").show();
                            }
                            $("#nowPage").html((index + 1).toString());
                            $("#toPage").val("");
                            $("#totalPage1").html(" / " + totalPage);
                            $("#totalPage2").html(" / " + totalPage);
                            $("#viewtable").show();
                            self.log.log(totalPage);
                        } else {
                            //console.log("no any data existed at this day!!!");
                            pageIndex = 0; //因查無資料或到底部故重設index
                            $("#viewtable").hide();
                            alert("查無資料!");
                        }
                    }).error(function (response) {
                        console.log("error!!!");
                    });
                }
                //self.log.log("----------------");
            };

            UsePublicVersionController.prototype.nextPage = function () {
                this.time(++pageIndex);
            };

            UsePublicVersionController.prototype.prePage = function () {
                if (--pageIndex < 0) {
                    this.time(0);
                    pageIndex = 0;
                } else {
                    this.time(pageIndex);
                }
            };
            UsePublicVersionController.prototype.firstPage = function () {
                pageIndex = 0; //重設index
                this.time(pageIndex);
            };

            UsePublicVersionController.prototype.toPage = function () {
                pageIndex = $("#toPage").val() - 1;
                this.time(pageIndex);
            };
            return UsePublicVersionController;
        })();
        usePublicVersion.UsePublicVersionController = UsePublicVersionController;
    })(tcm.usePublicVersion || (tcm.usePublicVersion = {}));
    var usePublicVersion = tcm.usePublicVersion;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../../typings/angularjs/angular.d.ts'/>
    /// <reference path='../../../typings/ngtable/ng-table.d.ts'/>
    (function (Medicine) {
        var MedicineController = (function () {
            function MedicineController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                /////////////////////////////
                this.setAC = function () {
                    $(function () {
                        $("[id^=effectinput]").autocomplete({
                            source: function (request, response) {
                                $.ajax({
                                    url: "searchMedicineAPI.do",
                                    type: 'POST',
                                    dataType: "text",
                                    data: "{action:\"get_standard_effectALLNew\",num: \"3\"}",
                                    success: function (data) {
                                        //alert(data);
                                        var returnData = [];
                                        data = JSON.parse(data);
                                        for (var i = 0; i < data.length; i++) {
                                            returnData.push(data[i].standard_effect);
                                        }

                                        //alert(JSON.stringify(returnData));
                                        //response(returnData);
                                        response($.ui.autocomplete.filter(returnData, request.term));
                                        $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                        $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                                    },
                                    error: function (xhr) {
                                        //alert(JSON.stringify(xhr));
                                    }
                                });
                            },
                            select: function (event, ui) {
                                $(this).val(ui.item.label);
                                $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                            }
                        });
                    });
                };
                /*這裡是中藥藥材的自動完成*/ this.setMEDAC = function () {
                    $(function () {
                        $("[id^=medicinefind]").autocomplete({
                            source: function (request, response) {
                                $.ajax({
                                    url: "searchMedicineAPI.do",
                                    type: 'POST',
                                    dataType: "text",
                                    data: "{action:\"get_medicine_from_SQL\"}",
                                    success: function (data) {
                                        var returnData = [];
                                        data = JSON.parse(data);
                                        for (var i = 0; i < data.length; i++) {
                                            returnData.push(data[i].medicine);
                                        }
                                        response($.ui.autocomplete.filter(returnData, request.term));
                                        $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                        $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                                    },
                                    error: function (xhr) {
                                        //alert(JSON.stringify(xhr));
                                    }
                                });
                            },
                            select: function (event, ui) {
                                $(this).val(ui.item.label);
                                $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                            }
                        });
                    });
                };
                /*方劑名稱的自動完成*/ this.setFONAC = function () {
                    $(function () {
                        $("[id^=findall]").autocomplete({
                            source: function (request, response) {
                                $.ajax({
                                    url: "searchMedicineAPI.do",
                                    type: 'POST',
                                    dataType: "text",
                                    data: "{action:\"get_fongji_from_SQL\"}",
                                    success: function (data) {
                                        var returnData = [];
                                        data = JSON.parse(data);
                                        for (var i = 0; i < data.length; i++) {
                                            returnData.push(data[i].prescription);
                                        }

                                        //alert(JSON.stringify(returnData));
                                        //response(returnData);
                                        response($.ui.autocomplete.filter(returnData, request.term));
                                        $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                        $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                                    },
                                    error: function (xhr) {
                                        //alert(JSON.stringify(xhr));
                                    }
                                });
                            },
                            select: function (event, ui) {
                                $(this).val(ui.item.label);
                                $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                            }
                        });
                    });
                };
                /*配伍PART的方劑自動完成*/
                this.setSCFONAC = function () {
                    $(function () {
                        $("[id^=fongjiFind]").autocomplete({
                            source: function (request, response) {
                                $.ajax({
                                    url: "searchMedicineAPI.do",
                                    type: 'POST',
                                    dataType: "text",
                                    data: "{action:\"get_fongji_from_SQL_SC\"}",
                                    success: function (data) {
                                        var returnData = [];
                                        data = JSON.parse(data);
                                        for (var i = 0; i < data.length; i++) {
                                            returnData.push(data[i].prescription);
                                        }

                                        //alert(JSON.stringify(returnData));
                                        //response(returnData);
                                        response($.ui.autocomplete.filter(returnData, request.term));
                                        $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                        $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                                    },
                                    error: function (xhr) {
                                        //alert(JSON.stringify(xhr));
                                    }
                                });
                            },
                            select: function (event, ui) {
                                $(this).val(ui.item.label);
                                $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                            }
                        });
                    });
                };
                this.addRow = function (singleSelect) {
                    var self = this;
                    switch (self.effectinputArray[singleSelect].length) {
                        case 0:
                            self.effectinputArray[singleSelect].push({ id: this.ccounter, effect: '', weight: '1.0' });
                            self.ccounter++;
                            break;
                        case 1:
                            self.effectinputArray[singleSelect][0].weight = '0.7';
                            self.effectinputArray[singleSelect].push({ id: this.ccounter, effect: '', weight: '0.3' });
                            self.ccounter++;
                            break;
                        case 2:
                            self.effectinputArray[singleSelect][0].weight = '0.6';
                            self.effectinputArray[singleSelect][1].weight = '0.3';
                            self.effectinputArray[singleSelect].push({ id: this.ccounter, effect: '', weight: '0.1' });
                            self.ccounter++;
                            break;
                        default:
                            alert('最多三種功效');
                            break;
                    }
                };
                this.selectmedicine = function (singleSelect, index) {
                    var self = this;

                    //alert(singleSelect);
                    /*self.http.post("searchMedicineAPI.do", {
                    action: "getSingleMedicineEffects",
                    Med: self.pickMedicineResult[index].name
                    }).success(function (response) {*/
                    var effects = "";
                    for (var i = 0; i < self.effectinputArray[singleSelect].length; i++) {
                        effects = effects + "。" + self.effectinputArray[singleSelect][i].effect;
                    }
                    effects = effects.substring(1);
                    self.selectMedicineResult[singleSelect - 1].push({ name: self.pickMedicineResult[index].name, score: self.pickMedicineResult[index].score, effect: effects });
                    self.pickMedicineResult.splice(index, 1);

                    //console.debug(self.selectMedicineResult);
                    var names = "";
                    for (var j = 0; j < 4; j++) {
                        for (var i = 0; i < self.selectMedicineResult[j].length; i++) {
                            names = names + "。" + self.selectMedicineResult[j][i].name;
                        }
                    }
                    self.http.post("searchMedicineAPI.do", {
                        action: "findPrescription",
                        medData: names.substring(1)
                    }).success(function (response) {
                        if (response != "") {
                            self.fongji = "方劑：" + response;
                        } else {
                            self.fongji = "";
                        }
                    });
                    /*});*/
                };
                this.printDiv = function (divName) {
                    $("input[type=text]").each(function () {
                        $("<div>" + $(this).val() + "</div>").insertBefore($(this));
                        $(this).hide();
                    });

                    var printContents = document.getElementById(divName).innerHTML;
                    var w = window.open();
                    w.document.write(printContents);
                    w.print();
                    w.close();

                    $("input[type=text]").each(function () {
                        $(this).prev("div").remove();
                        $(this).show();
                    });
                };
                this.delSelectMedicineRow = function (type, index) {
                    var self = this;
                    self.selectMedicineResult[type].splice(index, 1);
                    self.pickmedicine(type + 1);
                };
                this.delRow = function (singleSelect, index) {
                    var self = this;
                    switch (self.effectinputArray[singleSelect].length) {
                        case 0:
                            break;
                        case 1:
                            //self.effectinputArray[singleSelect].splice(index, 1);
                            alert('無法刪除最後一個功效。');
                            break;
                        case 2:
                            self.effectinputArray[singleSelect].splice(index, 1);
                            self.effectinputArray[singleSelect][0].weight = '1.0';
                            break;
                        case 3:
                            self.effectinputArray[singleSelect].splice(index, 1);
                            self.effectinputArray[singleSelect][0].weight = '0.7';
                            self.effectinputArray[singleSelect][1].weight = '0.3';
                        default:
                            break;
                    }
                    //alert(self.effectinputArray[index].effect);
                    //var item = self.effectinputArray.indexOf(index);
                    //self.effectinputArray.splice(item, 1);
                };
                this.pickmedicine = function (singleSelect) {
                    var self = this;
                    var effectArray = ["", "", ""];
                    for (var i = 0; i < self.effectinputArray[singleSelect].length; i++) {
                        if (self.effectinputArray[singleSelect][i].effect.length == 0) {
                            alert('功效' + (i + 1) + '尚未輸入！');
                            return;
                        } else {
                            effectArray[i] = $("#effectinput" + self.effectinputArray[singleSelect][i].id).val(); //self.effectinputArray[singleSelect][i].effect;
                        }
                    }

                    //console.debug(effectArray);
                    self.http.post("searchMedicineAPI.do", {
                        action: "pickmedicine",
                        effectone: effectArray[0],
                        effecttwo: effectArray[1],
                        effectthree: effectArray[2]
                    }).success(function (response) {
                        for (var j = 0; j < 4; j++) {
                            for (var i = 0; i < self.selectMedicineResult[j].length; i++) {
                                var delindex = -1;
                                for (var k = 0; k < response.length; k++) {
                                    if (response[k].name == self.selectMedicineResult[j][i].name) {
                                        delindex = k;
                                    }
                                }
                                if (delindex != -1) {
                                    response.splice(delindex, 1);
                                }
                            }
                        }
                        self.pickMedicineResult = response;
                    });
                };
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                this.modal = $modal;
                var self = this;

                this.tabs = [
                    { title: "多功效配伍查詢", template: "searchMedicine/CompatibilityOfMedicines.jsp" }
                ];
                self.get_original_effect();
                self.get_original_effect2();
                self.get_standard_effect_select();
                self.get_medicine_class();

                // self.get_medicine_original_name_search();
                self.View = 0;
                self.SearchView = 0;
                self.NOTPrescrption = 0;
                self.progressbar = false;

                this.a = [];
                this.b = [];
                this.c = [];
                this.cp = [];
                this.d = [];
                this.aEffect = [];
                this.bEffect = [];
                this.cEffect = [];
                this.dEffect = [];
                this.POISONArray = [];
                this.opti = [];
                this.blocks = [];

                this.effectinputArray = [
                    [],
                    [{ id: 1, effect: '', weight: '1.0' }],
                    [{ id: 1, effect: '', weight: '1.0' }],
                    [{ id: 1, effect: '', weight: '1.0' }],
                    [{ id: 1, effect: '', weight: '1.0' }]]; //'<a href="#">ad</a>', '<a href="#">ad2</a>'];
                this.ccounter = 3;
                this.pickMedicineResult = [];
                this.selectMedicineResult = [[], [], [], []];
            }
            MedicineController.prototype.get_original_effect3 = function () {
                var self = this;

                self.http.post("searchMedicine.do", { action: "get_original_effect" }).success(function (response) {
                    self.OriginalEffect = response;
                    self.log.log("OriginalEffect: " + self.OriginalEffect);
                });
            };

            MedicineController.prototype.get_original_effect = function () {
                var self = this;

                self.http.post("searchMedicine.do", { action: "get_original_effect" }).success(function (response) {
                    self.OriginalEffect = response;
                    self.log.log("OriginalEffect: " + self.OriginalEffect);
                });
            };
            MedicineController.prototype.get_original_effect2 = function () {
                var self = this;

                self.http.post("searchMedicine.do", { action: "get_original_effect2" }).success(function (response) {
                    self.OriginalEffect2 = response;
                    self.log.log("OriginalEffect2: " + self.OriginalEffect2);
                });
            };

            MedicineController.prototype.get_standard_effect_select = function () {
                var self = this;

                self.http.post("searchMedicine.do", { action: "get_standard_effect_select" }).success(function (response) {
                    self.StandardEffectSelect = response;
                    self.log.log("StandardEffectSelect: " + self.StandardEffectSelect);
                });
            };

            MedicineController.prototype.get_medicine_class = function () {
                var self = this;

                self.http.post("searchMedicine.do", { action: "get_medicine_class" }).success(function (response) {
                    self.MedicineClass = response;
                });
            };

            /*   public get_medicine_original_name_search() {
            var self = this;
            
            self.http.post("searchMedicine.do", { action: "get_medicine_original_name" }
            ).success(function(response: any) {
            self.OriginalmedName = response;
            });
            }*/
            MedicineController.prototype.get_medicine_classMed = function (classMed) {
                var self = this;

                self.http.post("searchMedicine.do", {
                    action: "get_medicine_classMed", classMed: classMed
                }).success(function (response) {
                    self.MedicineClassMed = response;
                });
            };

            MedicineController.prototype.get_SingleMedicine = function () {
                var self = this;

                self.http.post("searchMedicine.do", {
                    action: "get_SingleMedicine", Med: self.second_class
                }).success(function (response) {
                    self.MedInfo = response;
                    if (self.MedInfo.length != 0) {
                        self.View = 1;
                        self.second_class2 = self.MedInfo[0].med;
                    } else {
                        self.View = 0;
                    }
                });
            };

            MedicineController.prototype.addStandardEffect = function (original_effect) {
                var self = this;
                self.log.log("original_effect: " + original_effect);

                self.http.post("searchMedicine.do", {
                    action: "get_standard_effect", originalEffect: original_effect
                }).success(function (response) {
                    self.StandardEffect = response;
                    self.log.log("StandardEffect: " + self.StandardEffect);
                });
            };

            MedicineController.prototype.Search_Standard_MedName = function () {
                var self = this;
                if (self.StrOriginalMedName == "") {
                    self.StrStandardMedName = "";
                } else {
                    self.http.post("searchMedicine.do", {
                        action: "get_standard_MedName", OriginalMedName: self.StrOriginalMedName
                    }).success(function (response) {
                        self.StrStandardMedName = response;
                    });
                }
            };

            MedicineController.prototype.Search_Original_MedName = function () {
                var self = this;
                if (self.StrStandardMedName == "") {
                    self.StrOriginalMedName = "";
                } else {
                    self.http.post("searchMedicine.do", {
                        action: "get_original_MedName", StandardMedName: self.StrStandardMedName
                    }).success(function (response) {
                        self.StrOriginalMedName = response;
                    });
                }
            };

            //  public effectCombination() {  //標準功效查詢: 標準功效雙擊效果
            //       var self = this;
            //      var showinputeffect = $("#showinputeffect").val();
            //      var standard_effect = $("#standard_effect").val();
            //
            //      if (showinputeffect.indexOf("。") > -1 && showinputeffect.indexOf(standard_effect) == -1 && standard_effect.localeCompare(null) != 0) {
            //          $("#showinputeffect").val(showinputeffect + standard_effect + "。");
            //      } else if (showinputeffect.indexOf("。") == -1 && standard_effect.localeCompare(null) != 0) {
            //          $("#showinputeffect").val(standard_effect + "。");
            //      } /*else if (test.indexOf(txt) > -1) {
            //			$("#showinputeffect").html(test.replace(txt + "。", ""));
            //		}*/
            //  }
            MedicineController.prototype.clear_showinputeffect = function () {
                var self = this;
                $("#showinputeffect").val("");
            };

            MedicineController.prototype.searchMedicine = function () {
                var self = this;
                var showinputeffect = $("#showinputeffect").val();
                self.log.log(showinputeffect);

                self.http.post("searchMedicine.do", {
                    action: "searchMedicine", standard_effect: showinputeffect
                }).success(function (response) {
                    if (response.length != 0) {
                        self.SearchMedInfo = response;
                        self.SearchView = 1;
                        $("#showMedicine").html("");
                    } else {
                        $("#showMedicine").html("查無此藥材");
                        self.SearchView = 0;
                    }
                });
            };

            MedicineController.prototype.Pawo = function () {
                var self = this;
                var effectone = $("#effectone").val();
                var effecttwo = $("#effecttwo").val();
                var effectthree = $("#effectthree").val();
                var effectfour = $("#effectfour").val();
                self.log.log(effectone);
                self.log.log(effecttwo);
                self.log.log(effectthree);
                self.log.log(effectfour);
                self.progressbar = true;
                $("#myBar").width('0%');
                self.width = 1;
                var id = setInterval(frame, 10);
                function frame() {
                    if (self.width >= 100) {
                        clearInterval(id);
                    } else {
                        self.width++;

                        if (self.width < 100) {
                            $("#myBar").width(self.width + '%');
                            $("#myBar").html(Math.floor(self.width / 3) + '%');
                        } else {
                            $("#myBar").width(self.width + '%');
                            $("#myBar").html(self.width + '%');
                        }
                    }
                }

                self.a = [];
                self.b = [];
                self.c = [];
                self.d = [];
                self.aEffect = [];
                self.bEffect = [];
                self.cEffect = [];
                self.dEffect = [];
                self.POISONArray = [];

                self.http.post("searchMedicine.do", {
                    action: "pawo",
                    effectone: effectone,
                    effecttwo: effecttwo,
                    effectthree: effectthree,
                    effectfour: effectfour,
                    key: 0
                }).success(function (response) {
                    // self.pawo = response;
                    self.opti = response;
                    self.progressbar = false;
                    self.log.log("self.opti[0].ooo.length: " + self.opti[0].one.length);

                    //  self.log.log("self.opti[1].ooo.length: " + self.opti[1].ooo.length);
                    self.log.log("self.opti.length: " + self.opti.length);

                    self.PresctirtionName = self.opti[0].PresctirtionName;

                    if (self.opti[0].one.length != 0) {
                        self.NOTPrescrption = 0;
                        for (var i = 0; i < self.opti.length; i++) {
                            if (self.opti[i].one.length != 0) {
                                self.a[i] = self.opti[i].one[0];
                                self.aEffect[i] = self.opti[i].oo[0];
                            }
                            if (self.opti[i].two.length != 0) {
                                self.b[i] = self.opti[i].two[0];
                                self.bEffect[i] = self.opti[i].tt[0];
                            }
                            if (self.opti[i].three.length != 0) {
                                self.c[i] = self.opti[i].three[0];
                                self.cEffect[i] = self.opti[i].rr[0];
                            }
                            if (self.opti[i].four.length != 0) {
                                self.d[i] = self.opti[i].four[0];
                                self.dEffect[i] = self.opti[i].ff[0];
                            }
                        }
                    } else {
                        self.NOTPrescrption = 1;
                    }
                    self.log.log("self.opti[0].threePOSION: " + self.opti[0].threePOSION);
                    for (var i = 0; i < self.cp.length; i++) {
                        self.cp[i] = "";
                    }
                });
            };

            MedicineController.prototype.DisplayEffect = function (index, num, med) {
                var self = this;
                self.log.log("index num med: " + index + "~~" + num + "~~" + med);

                self.progressbar = true;
                $("#myBar").width('0%');
                self.width = 1;
                var id = setInterval(frame, 10);
                function frame() {
                    if (self.width >= 100) {
                        clearInterval(id);
                    } else {
                        self.width++;
                        $("#myBar").width(self.width + '%');
                        if (self.width < 95) {
                            $("#myBar").html(Math.floor(self.width / 3) + '%');
                        } else {
                            $("#myBar").html(self.width + '%');
                        }
                    }
                }

                var effectone = $("#effectone").val();
                var effecttwo = $("#effecttwo").val();
                var effectthree = $("#effectthree").val();
                var effectfour = $("#effectfour").val();

                if (num == 1) {
                    var medData = "";
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.a[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].one.length; i++) {
                        if (self.opti[index].one[i] == med) {
                            self.aEffect[index] = self.opti[index].oo[i];
                        }
                    }

                    self.http.post("searchMedicine.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        key: 1
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].one.length != 0) {
                                    self.a[i] = self.opti[i].one[0];
                                    self.aEffect[i] = self.opti[i].oo[0];
                                }
                            }
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].two.length != 0) {
                                    self.b[j] = self.opti[j].two[0];
                                    self.bEffect[j] = self.opti[j].tt[0];
                                }
                                if (self.opti[j].three.length != 0) {
                                    self.c[j] = self.opti[j].three[0];
                                    self.cEffect[j] = self.opti[j].rr[0];
                                }
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 2) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.b[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].two.length; i++) {
                        if (self.opti[index].two[i] == med) {
                            self.bEffect[index] = self.opti[index].tt[i];
                        }
                    }

                    self.http.post("searchMedicine.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        key: 1
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].two.length != 0) {
                                    self.b[i] = self.opti[i].two[0];
                                    self.bEffect[i] = self.opti[i].tt[0];
                                }
                            }
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].three.length != 0) {
                                    self.c[j] = self.opti[j].three[0];
                                    self.cEffect[j] = self.opti[j].rr[0];
                                }
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 3) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < self.b.length; i++) {
                        medData += self.b[i] + "。";
                    }
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.c[i] + "。";
                    }
                    var POSION = "";
                    for (var i = 0; i < self.cp.length; i++) {
                        POSION += self.cp[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].three.length; i++) {
                        if (self.opti[index].three[i] == med) {
                            self.cEffect[index] = self.opti[index].rr[i];
                        }
                    }

                    self.http.post("searchMedicine.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        POSION: POSION,
                        key: 2
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].three.length != 0) {
                                    self.c[i] = self.opti[i].three[0];
                                    self.cEffect[i] = self.opti[i].rr[0];
                                }
                            }
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 4) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < self.b.length; i++) {
                        medData += self.b[i] + "。";
                    }
                    for (var i = 0; i < self.c.length; i++) {
                        medData += self.c[i] + "。";
                    }
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.d[i] + "。";
                    }
                    var POSION = "";
                    for (var i = 0; i < self.cp.length; i++) {
                        POSION += self.cp[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].four.length; i++) {
                        if (self.opti[index].four[i] == med) {
                            self.dEffect[index] = self.opti[index].ff[i];
                        }
                    }

                    self.http.post("searchMedicine.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        POSION: POSION,
                        key: 2
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].four.length != 0) {
                                    self.d[i] = self.opti[i].four[0];
                                    self.dEffect[i] = self.opti[i].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 5) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < self.b.length; i++) {
                        medData += self.b[i] + "。";
                    }
                    var POSION = "";
                    for (var i = 0; i < self.cp.length; i++) {
                        POSION += self.cp[i] + "。";
                    }
                    self.log.log("POSION: " + POSION);

                    self.http.post("searchMedicine.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        POSION: POSION,
                        key: 2
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].three.length != 0) {
                                    self.c[j] = self.opti[j].three[0];
                                    self.cEffect[j] = self.opti[j].rr[0];
                                }
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                }

                if (num < 3) {
                    for (var i = 0; i < self.cp.length; i++) {
                        self.cp[i] = "";
                    }
                }
            };

            //----------------------------------------------------------------------------------------------------------------//
            MedicineController.prototype.open = function (num) {
                var self = this;
                var modalInstance = self.modal.open({
                    templateUrl: 'searchMedicine/standardeffect_model.jsp',
                    controller: 'tcm.Medicine.ModalstandardeffectController',
                    resolve: {
                        num: function () {
                            return num;
                        }
                    }
                });
                modalInstance.result.then(function () {
                });
            };
            return MedicineController;
        })();
        Medicine.MedicineController = MedicineController;

        var ModalstandardeffectController = (function () {
            function ModalstandardeffectController($scope, $modalInstance, $http, $log, $modal, num) {
                this.standardeffect_model = [];
                this.cancel = function () {
                    this.modalInstance.dismiss('cancel');
                };
                var self = this;
                self.scope = $scope;
                self.scope.viewModel = this;
                self.modalInstance = $modalInstance;
                self.http = $http;
                self.log = $log;
                self.modal = $modal;
                self.nums = num;

                if (self.nums == "1") {
                    self.effectone = $("#effectone").val(); //JQuery
                } else if (self.nums == "2") {
                    self.effectone = $("#effecttwo").val();
                } else if (self.nums == "3") {
                    self.effectone = $("#effectthree").val();
                } else if (self.nums == "4") {
                    self.effectone = $("#effectfour").val();
                } else if (self.nums == "5") {
                    self.effectone = $("#showinputeffect").val();
                }

                //window["tcm_context_path"] + "/searchMedicine.do"
                self.http.post("searchMedicine.do", {
                    action: "get_standard_effectALL",
                    num: self.nums
                }).success(function (response, status) {
                    self.standardeffect_model = response;
                    self.log.log("standardeffect_model: " + self.standardeffect_model);
                });
            }
            ModalstandardeffectController.prototype.addStandardEffect_model = function (effect) {
                var self = this;

                if (self.effectone.indexOf("。") > -1 && self.effectone.indexOf(effect) == -1) {
                    self.effectone = self.effectone + effect + "。";
                    self.log.log("1");
                } else if (self.effectone.indexOf("。") == -1) {
                    self.effectone = effect + "。";
                    self.log.log("2");
                } else if (self.effectone.indexOf(effect) > -1) {
                    self.effectone = self.effectone.replace(effect + "。", "");
                    self.log.log("3");
                }
            };

            ModalstandardeffectController.prototype.enter_model = function (effect_al) {
                var self = this;

                if (self.nums == "1") {
                    $("#effectone").val(effect_al);
                } else if (self.nums == "2") {
                    $("#effecttwo").val(effect_al);
                } else if (self.nums == "3") {
                    $("#effectthree").val(effect_al);
                } else if (self.nums == "4") {
                    $("#effectfour").val(effect_al);
                } else if (self.nums == "5") {
                    $("#showinputeffect").val(effect_al);
                }

                self.modalInstance.dismiss('cancel');
            };
            ModalstandardeffectController.prototype.clear_model = function () {
                var self = this;
                self.effectone = "";
            };
            return ModalstandardeffectController;
        })();
        Medicine.ModalstandardeffectController = ModalstandardeffectController;
    })(tcm.Medicine || (tcm.Medicine = {}));
    var Medicine = tcm.Medicine;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../../typings/angularjs/angular.d.ts'/>
    /// <reference path='../../../typings/ngtable/ng-table.d.ts'/>
    (function (MedicineLibrary) {
        var MedicineLibraryController = (function () {
            //增加
            //private UnConfirmtableParams: any;
            //private AllUnConfirmData: symptomsMaintainData[];
            //private UnConfirmList: symptomsMaintainData[];
            //private SymptomsMappingtableParams: any;
            //換成下面的private AllSymptomsMappingData: SymptomsMappingMaintainData[];
            //換成下面的private SymptomsMappingList: SymptomsMappingMaintainData[];
            function MedicineLibraryController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                /////////////////////////////
                this.setAC = function () {
                    $(function () {
                        $("[id^=effectinput]").autocomplete({
                            source: function (request, response) {
                                $.ajax({
                                    url: "searchMedicineAPI.do",
                                    type: 'POST',
                                    dataType: "text",
                                    data: "{action:\"get_standard_effectALLNew\",num: \"3\"}",
                                    success: function (data) {
                                        //alert(data);
                                        var returnData = [];
                                        data = JSON.parse(data);
                                        for (var i = 0; i < data.length; i++) {
                                            returnData.push(data[i].standard_effect);
                                        }

                                        //alert(JSON.stringify(returnData));
                                        //response(returnData);
                                        response($.ui.autocomplete.filter(returnData, request.term));
                                        $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                        $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                                    },
                                    error: function (xhr) {
                                        //alert(JSON.stringify(xhr));
                                    }
                                });
                            },
                            select: function (event, ui) {
                                $(this).val(ui.item.label);
                                $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                            }
                        });
                    });
                };
                this.addRow = function (singleSelect) {
                    var self = this;
                    switch (self.effectinputArray[singleSelect].length) {
                        case 0:
                            self.effectinputArray[singleSelect].push({ id: this.ccounter, effect: '', weight: '1.0' });
                            self.ccounter++;
                            break;
                        case 1:
                            self.effectinputArray[singleSelect][0].weight = '0.7';
                            self.effectinputArray[singleSelect].push({ id: this.ccounter, effect: '', weight: '0.3' });
                            self.ccounter++;
                            break;
                        case 2:
                            self.effectinputArray[singleSelect][0].weight = '0.6';
                            self.effectinputArray[singleSelect][1].weight = '0.3';
                            self.effectinputArray[singleSelect].push({ id: this.ccounter, effect: '', weight: '0.1' });
                            self.ccounter++;
                            break;
                        default:
                            alert('最多三種功效');
                            break;
                    }
                };
                this.selectmedicine = function (singleSelect, index) {
                    var self = this;

                    //alert(singleSelect);
                    /*self.http.post("searchMedicineAPI.do", {
                    action: "getSingleMedicineEffects",
                    Med: self.pickMedicineResult[index].name
                    }).success(function (response) {*/
                    var effects = "";
                    for (var i = 0; i < self.effectinputArray[singleSelect].length; i++) {
                        effects = effects + "。" + self.effectinputArray[singleSelect][i].effect;
                    }
                    effects = effects.substring(1);
                    self.selectMedicineResult[singleSelect - 1].push({ name: self.pickMedicineResult[index].name, score: self.pickMedicineResult[index].score, effect: effects });
                    self.pickMedicineResult.splice(index, 1);

                    //console.debug(self.selectMedicineResult);
                    var names = "";
                    for (var j = 0; j < 4; j++) {
                        for (var i = 0; i < self.selectMedicineResult[j].length; i++) {
                            names = names + "。" + self.selectMedicineResult[j][i].name;
                        }
                    }
                    self.http.post("searchMedicineAPI.do", {
                        action: "findPrescription",
                        medData: names.substring(1)
                    }).success(function (response) {
                        if (response != "") {
                            self.fongji = "方劑：" + response;
                        } else {
                            self.fongji = "";
                        }
                    });
                    /*});*/
                };
                this.printDiv = function (divName) {
                    $("input[type=text]").each(function () {
                        $("<div>" + $(this).val() + "</div>").insertBefore($(this));
                        $(this).hide();
                    });

                    var printContents = document.getElementById(divName).innerHTML;
                    var w = window.open();
                    w.document.write(printContents);
                    w.print();
                    w.close();

                    $("input[type=text]").each(function () {
                        $(this).prev("div").remove();
                        $(this).show();
                    });
                };
                this.delSelectMedicineRow = function (type, index) {
                    var self = this;
                    self.selectMedicineResult[type].splice(index, 1);
                    self.pickmedicine(type + 1);
                };
                this.delRow = function (singleSelect, index) {
                    var self = this;
                    switch (self.effectinputArray[singleSelect].length) {
                        case 0:
                            break;
                        case 1:
                            //self.effectinputArray[singleSelect].splice(index, 1);
                            alert('無法刪除最後一個功效。');
                            break;
                        case 2:
                            self.effectinputArray[singleSelect].splice(index, 1);
                            self.effectinputArray[singleSelect][0].weight = '1.0';
                            break;
                        case 3:
                            self.effectinputArray[singleSelect].splice(index, 1);
                            self.effectinputArray[singleSelect][0].weight = '0.7';
                            self.effectinputArray[singleSelect][1].weight = '0.3';
                        default:
                            break;
                    }
                    //alert(self.effectinputArray[index].effect);
                    //var item = self.effectinputArray.indexOf(index);
                    //self.effectinputArray.splice(item, 1);
                };
                this.pickmedicine = function (singleSelect) {
                    var self = this;
                    var effectArray = ["", "", ""];
                    for (var i = 0; i < self.effectinputArray[singleSelect].length; i++) {
                        if (self.effectinputArray[singleSelect][i].effect.length == 0) {
                            alert('功效' + (i + 1) + '尚未輸入！');
                            return;
                        } else {
                            effectArray[i] = $("#effectinput" + self.effectinputArray[singleSelect][i].id).val(); //self.effectinputArray[singleSelect][i].effect;
                        }
                    }

                    //console.debug(effectArray);
                    self.http.post("searchMedicineAPI.do", {
                        action: "pickmedicine",
                        effectone: effectArray[0],
                        effecttwo: effectArray[1],
                        effectthree: effectArray[2]
                    }).success(function (response) {
                        for (var j = 0; j < 4; j++) {
                            for (var i = 0; i < self.selectMedicineResult[j].length; i++) {
                                var delindex = -1;
                                for (var k = 0; k < response.length; k++) {
                                    if (response[k].name == self.selectMedicineResult[j][i].name) {
                                        delindex = k;
                                    }
                                }
                                if (delindex != -1) {
                                    response.splice(delindex, 1);
                                }
                            }
                        }
                        self.pickMedicineResult = response;
                    });
                };
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;

                //增加
                //this.UnConfirmList = [];
                //this.SymptomsMappingList = [];
                //增加
                this.modal = $modal;
                var self = this;

                this.tabs = [
                    { title: "單一藥材查詢", template: "searchMedicine/MedicineEffect.jsp" },
                    { title: "同功效藥材查詢", template: "searchMedicine/EffectSearchMedicine.jsp" },
                    { title: "藥材標準名稱查詢", template: "searchMedicine/MedicineStandardSearch.jsp" },
                    { title: "功效標準名稱查詢", template: "searchMedicine/searchMedicine.jsp" }
                ];
                self.get_original_effect();
                self.get_original_effect2();
                self.get_standard_effect_select();
                self.get_medicine_class();

                // self.get_medicine_original_name_search();
                self.View = 0;
                self.SearchView = 0;
                self.NOTPrescrption = 0;
                self.progressbar = false;

                this.a = [];
                this.b = [];
                this.c = [];
                this.cp = [];
                this.d = [];
                this.aEffect = [];
                this.bEffect = [];
                this.cEffect = [];
                this.dEffect = [];
                this.POISONArray = [];
                this.opti = [];
                this.blocks = [];

                this.effectinputArray = [
                    [],
                    [{ id: 1, effect: '', weight: '1.0' }],
                    [{ id: 1, effect: '', weight: '1.0' }],
                    [{ id: 1, effect: '', weight: '1.0' }],
                    [{ id: 1, effect: '', weight: '1.0' }]]; //'<a href="#">ad</a>', '<a href="#">ad2</a>'];
                this.ccounter = 3;
                this.pickMedicineResult = [];
                this.selectMedicineResult = [[], [], [], []];
            }
            MedicineLibraryController.prototype.get_original_effect3 = function () {
                var self = this;

                self.http.post("MedicineLibrary.do", { action: "get_original_effect" }).success(function (response) {
                    self.OriginalEffect = response;
                    self.log.log("OriginalEffect: " + self.OriginalEffect);
                });
            };

            MedicineLibraryController.prototype.get_original_effect = function () {
                var self = this;

                self.http.post("MedicineLibrary.do", { action: "get_original_effect" }).success(function (response) {
                    self.OriginalEffect = response;
                    self.log.log("OriginalEffect: " + self.OriginalEffect);
                });
            };
            MedicineLibraryController.prototype.get_original_effect2 = function () {
                var self = this;

                self.http.post("MedicineLibrary.do", { action: "get_original_effect2" }).success(function (response) {
                    self.OriginalEffect2 = response;
                    self.log.log("OriginalEffect2: " + self.OriginalEffect2);
                });
            };

            MedicineLibraryController.prototype.get_standard_effect_select = function () {
                var self = this;

                self.http.post("MedicineLibrary.do", { action: "get_standard_effect_select" }).success(function (response) {
                    self.StandardEffectSelect = response;
                    self.log.log("StandardEffectSelect: " + self.StandardEffectSelect);
                });
            };

            MedicineLibraryController.prototype.get_medicine_class = function () {
                var self = this;

                self.http.post("MedicineLibrary.do", { action: "get_medicine_class" }).success(function (response) {
                    self.MedicineClass = response;
                });
            };

            MedicineLibraryController.prototype.get_medicine_classMed = function (classMed) {
                var self = this;

                self.http.post("MedicineLibrary.do", {
                    action: "get_medicine_classMed", classMed: classMed
                }).success(function (response) {
                    self.MedicineClassMed = response;
                });
            };

            MedicineLibraryController.prototype.get_SingleMedicine = function () {
                var self = this;

                self.http.post("MedicineLibrary.do", {
                    action: "get_SingleMedicine", Med: self.second_class
                }).success(function (response) {
                    self.MedInfo = response;
                    if (self.MedInfo.length != 0) {
                        self.View = 1;
                        self.second_class2 = self.MedInfo[0].med;
                    } else {
                        self.View = 0;
                    }
                });
            };

            MedicineLibraryController.prototype.addStandardEffect = function (original_effect) {
                var self = this;
                self.log.log("original_effect: " + original_effect);

                self.http.post("MedicineLibrary.do", {
                    action: "get_standard_effect", originalEffect: original_effect
                }).success(function (response) {
                    self.StandardEffect = response;
                    self.log.log("StandardEffect: " + self.StandardEffect);
                });
            };

            MedicineLibraryController.prototype.Search_Standard_MedName = function () {
                var self = this;
                if (self.StrOriginalMedName == "") {
                    self.StrStandardMedName = "";
                } else {
                    self.http.post("MedicineLibrary.do", {
                        action: "get_standard_MedName", OriginalMedName: self.StrOriginalMedName
                    }).success(function (response) {
                        self.StrStandardMedName = response;
                    });
                }
            };

            MedicineLibraryController.prototype.Search_Original_MedName = function () {
                var self = this;
                if (self.StrStandardMedName == "") {
                    self.StrOriginalMedName = "";
                } else {
                    self.http.post("MedicineLibrary.do", {
                        action: "get_original_MedName", StandardMedName: self.StrStandardMedName
                    }).success(function (response) {
                        self.StrOriginalMedName = response;
                    });
                }
            };

            //  public effectCombination() {  //標準功效查詢: 標準功效雙擊效果
            //       var self = this;
            //      var showinputeffect = $("#showinputeffect").val();
            //      var standard_effect = $("#standard_effect").val();
            //
            //      if (showinputeffect.indexOf("。") > -1 && showinputeffect.indexOf(standard_effect) == -1 && standard_effect.localeCompare(null) != 0) {
            //          $("#showinputeffect").val(showinputeffect + standard_effect + "。");
            //      } else if (showinputeffect.indexOf("。") == -1 && standard_effect.localeCompare(null) != 0) {
            //          $("#showinputeffect").val(standard_effect + "。");
            //      } /*else if (test.indexOf(txt) > -1) {
            //			$("#showinputeffect").html(test.replace(txt + "。", ""));
            //		}*/
            //  }
            MedicineLibraryController.prototype.clear_showinputeffect = function () {
                var self = this;
                $("#showinputeffect").val("");
            };

            MedicineLibraryController.prototype.searchMedicine = function () {
                var self = this;
                var showinputeffect = $("#showinputeffect").val();
                self.log.log(showinputeffect);

                self.http.post("MedicineLibrary.do", {
                    action: "searchMedicine", standard_effect: showinputeffect
                }).success(function (response) {
                    if (response.length != 0) {
                        self.SearchMedInfo = response;
                        self.SearchView = 1;
                        $("#showMedicine").html("");
                    } else {
                        $("#showMedicine").html("查無此藥材");
                        self.SearchView = 0;
                    }
                });
            };

            MedicineLibraryController.prototype.Pawo = function () {
                var self = this;
                var effectone = $("#effectone").val();
                var effecttwo = $("#effecttwo").val();
                var effectthree = $("#effectthree").val();
                var effectfour = $("#effectfour").val();
                self.log.log(effectone);
                self.log.log(effecttwo);
                self.log.log(effectthree);
                self.log.log(effectfour);
                self.progressbar = true;
                $("#myBar").width('0%');
                self.width = 1;
                var id = setInterval(frame, 10);
                function frame() {
                    if (self.width >= 100) {
                        clearInterval(id);
                    } else {
                        self.width++;

                        if (self.width < 100) {
                            $("#myBar").width(self.width + '%');
                            $("#myBar").html(Math.floor(self.width / 3) + '%');
                        } else {
                            $("#myBar").width(self.width + '%');
                            $("#myBar").html(self.width + '%');
                        }
                    }
                }

                self.a = [];
                self.b = [];
                self.c = [];
                self.d = [];
                self.aEffect = [];
                self.bEffect = [];
                self.cEffect = [];
                self.dEffect = [];
                self.POISONArray = [];

                self.http.post("MedicineLibrary.do", {
                    action: "pawo",
                    effectone: effectone,
                    effecttwo: effecttwo,
                    effectthree: effectthree,
                    effectfour: effectfour,
                    key: 0
                }).success(function (response) {
                    // self.pawo = response;
                    self.opti = response;
                    self.progressbar = false;
                    self.log.log("self.opti[0].ooo.length: " + self.opti[0].one.length);

                    //  self.log.log("self.opti[1].ooo.length: " + self.opti[1].ooo.length);
                    self.log.log("self.opti.length: " + self.opti.length);

                    self.PresctirtionName = self.opti[0].PresctirtionName;

                    if (self.opti[0].one.length != 0) {
                        self.NOTPrescrption = 0;
                        for (var i = 0; i < self.opti.length; i++) {
                            if (self.opti[i].one.length != 0) {
                                self.a[i] = self.opti[i].one[0];
                                self.aEffect[i] = self.opti[i].oo[0];
                            }
                            if (self.opti[i].two.length != 0) {
                                self.b[i] = self.opti[i].two[0];
                                self.bEffect[i] = self.opti[i].tt[0];
                            }
                            if (self.opti[i].three.length != 0) {
                                self.c[i] = self.opti[i].three[0];
                                self.cEffect[i] = self.opti[i].rr[0];
                            }
                            if (self.opti[i].four.length != 0) {
                                self.d[i] = self.opti[i].four[0];
                                self.dEffect[i] = self.opti[i].ff[0];
                            }
                        }
                    } else {
                        self.NOTPrescrption = 1;
                    }
                    self.log.log("self.opti[0].threePOSION: " + self.opti[0].threePOSION);
                    for (var i = 0; i < self.cp.length; i++) {
                        self.cp[i] = "";
                    }
                });
            };

            MedicineLibraryController.prototype.DisplayEffect = function (index, num, med) {
                var self = this;
                self.log.log("index num med: " + index + "~~" + num + "~~" + med);

                self.progressbar = true;
                $("#myBar").width('0%');
                self.width = 1;
                var id = setInterval(frame, 10);
                function frame() {
                    if (self.width >= 100) {
                        clearInterval(id);
                    } else {
                        self.width++;
                        $("#myBar").width(self.width + '%');
                        if (self.width < 95) {
                            $("#myBar").html(Math.floor(self.width / 3) + '%');
                        } else {
                            $("#myBar").html(self.width + '%');
                        }
                    }
                }

                var effectone = $("#effectone").val();
                var effecttwo = $("#effecttwo").val();
                var effectthree = $("#effectthree").val();
                var effectfour = $("#effectfour").val();

                if (num == 1) {
                    var medData = "";
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.a[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].one.length; i++) {
                        if (self.opti[index].one[i] == med) {
                            self.aEffect[index] = self.opti[index].oo[i];
                        }
                    }

                    self.http.post("MedicineLibrary.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        key: 1
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].one.length != 0) {
                                    self.a[i] = self.opti[i].one[0];
                                    self.aEffect[i] = self.opti[i].oo[0];
                                }
                            }
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].two.length != 0) {
                                    self.b[j] = self.opti[j].two[0];
                                    self.bEffect[j] = self.opti[j].tt[0];
                                }
                                if (self.opti[j].three.length != 0) {
                                    self.c[j] = self.opti[j].three[0];
                                    self.cEffect[j] = self.opti[j].rr[0];
                                }
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 2) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.b[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].two.length; i++) {
                        if (self.opti[index].two[i] == med) {
                            self.bEffect[index] = self.opti[index].tt[i];
                        }
                    }

                    self.http.post("MedicineLibrary.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        key: 1
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].two.length != 0) {
                                    self.b[i] = self.opti[i].two[0];
                                    self.bEffect[i] = self.opti[i].tt[0];
                                }
                            }
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].three.length != 0) {
                                    self.c[j] = self.opti[j].three[0];
                                    self.cEffect[j] = self.opti[j].rr[0];
                                }
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 3) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < self.b.length; i++) {
                        medData += self.b[i] + "。";
                    }
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.c[i] + "。";
                    }
                    var POSION = "";
                    for (var i = 0; i < self.cp.length; i++) {
                        POSION += self.cp[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].three.length; i++) {
                        if (self.opti[index].three[i] == med) {
                            self.cEffect[index] = self.opti[index].rr[i];
                        }
                    }

                    self.http.post("MedicineLibrary.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        POSION: POSION,
                        key: 2
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].three.length != 0) {
                                    self.c[i] = self.opti[i].three[0];
                                    self.cEffect[i] = self.opti[i].rr[0];
                                }
                            }
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 4) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < self.b.length; i++) {
                        medData += self.b[i] + "。";
                    }
                    for (var i = 0; i < self.c.length; i++) {
                        medData += self.c[i] + "。";
                    }
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.d[i] + "。";
                    }
                    var POSION = "";
                    for (var i = 0; i < self.cp.length; i++) {
                        POSION += self.cp[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].four.length; i++) {
                        if (self.opti[index].four[i] == med) {
                            self.dEffect[index] = self.opti[index].ff[i];
                        }
                    }

                    self.http.post("MedicineLibrary.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        POSION: POSION,
                        key: 2
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].four.length != 0) {
                                    self.d[i] = self.opti[i].four[0];
                                    self.dEffect[i] = self.opti[i].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 5) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < self.b.length; i++) {
                        medData += self.b[i] + "。";
                    }
                    var POSION = "";
                    for (var i = 0; i < self.cp.length; i++) {
                        POSION += self.cp[i] + "。";
                    }
                    self.log.log("POSION: " + POSION);

                    self.http.post("MedicineLibrary.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        POSION: POSION,
                        key: 2
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].three.length != 0) {
                                    self.c[j] = self.opti[j].three[0];
                                    self.cEffect[j] = self.opti[j].rr[0];
                                }
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                }

                if (num < 3) {
                    for (var i = 0; i < self.cp.length; i++) {
                        self.cp[i] = "";
                    }
                }
            };

            //----------------------------------------------------------------------------------------------------------------//
            MedicineLibraryController.prototype.open = function (num) {
                var self = this;
                var modalInstance = self.modal.open({
                    templateUrl: 'searchMedicine/standardeffect_model.jsp',
                    controller: 'tcm.Medicine.ModalstandardeffectController',
                    resolve: {
                        num: function () {
                            return num;
                        }
                    }
                });
                modalInstance.result.then(function () {
                });
            };
            return MedicineLibraryController;
        })();
        MedicineLibrary.MedicineLibraryController = MedicineLibraryController;

        var ModalstandardeffectController = (function () {
            function ModalstandardeffectController($scope, $modalInstance, $http, $log, $modal, num) {
                this.standardeffect_model = [];
                this.cancel = function () {
                    this.modalInstance.dismiss('cancel');
                };
                var self = this;
                self.scope = $scope;
                self.scope.viewModel = this;
                self.modalInstance = $modalInstance;
                self.http = $http;
                self.log = $log;
                self.modal = $modal;
                self.nums = num;

                if (self.nums == "1") {
                    self.effectone = $("#effectone").val(); //JQuery
                } else if (self.nums == "2") {
                    self.effectone = $("#effecttwo").val();
                } else if (self.nums == "3") {
                    self.effectone = $("#effectthree").val();
                } else if (self.nums == "4") {
                    self.effectone = $("#effectfour").val();
                } else if (self.nums == "5") {
                    self.effectone = $("#showinputeffect").val();
                }

                //window["tcm_context_path"] + "/searchMedicine.do"
                self.http.post("MedicineLibrary.do", {
                    action: "get_standard_effectALL",
                    num: self.nums
                }).success(function (response, status) {
                    self.standardeffect_model = response;
                    self.log.log("standardeffect_model: " + self.standardeffect_model);
                });
            }
            ModalstandardeffectController.prototype.addStandardEffect_model = function (effect) {
                var self = this;

                if (self.effectone.indexOf("。") > -1 && self.effectone.indexOf(effect) == -1) {
                    self.effectone = self.effectone + effect + "。";
                    self.log.log("1");
                } else if (self.effectone.indexOf("。") == -1) {
                    self.effectone = effect + "。";
                    self.log.log("2");
                } else if (self.effectone.indexOf(effect) > -1) {
                    self.effectone = self.effectone.replace(effect + "。", "");
                    self.log.log("3");
                }
            };

            ModalstandardeffectController.prototype.enter_model = function (effect_al) {
                var self = this;

                if (self.nums == "1") {
                    $("#effectone").val(effect_al);
                } else if (self.nums == "2") {
                    $("#effecttwo").val(effect_al);
                } else if (self.nums == "3") {
                    $("#effectthree").val(effect_al);
                } else if (self.nums == "4") {
                    $("#effectfour").val(effect_al);
                } else if (self.nums == "5") {
                    $("#showinputeffect").val(effect_al);
                }

                self.modalInstance.dismiss('cancel');
            };
            ModalstandardeffectController.prototype.clear_model = function () {
                var self = this;
                self.effectone = "";
            };
            return ModalstandardeffectController;
        })();
        MedicineLibrary.ModalstandardeffectController = ModalstandardeffectController;
    })(tcm.MedicineLibrary || (tcm.MedicineLibrary = {}));
    var MedicineLibrary = tcm.MedicineLibrary;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../../typings/angularjs/angular.d.ts'/>
    /// <reference path='../../../typings/ngtable/ng-table.d.ts'/>
    (function (Medicine_old) {
        var MedicineController_old = (function () {
            function MedicineController_old($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                /////////////////////////////
                this.setAC = function () {
                    $(function () {
                        $("[id^=effectinput]").autocomplete({
                            source: function (request, response) {
                                $.ajax({
                                    url: "searchMedicineAPI.do",
                                    type: 'POST',
                                    dataType: "text",
                                    data: "{action:\"get_standard_effectALLNew\",num: \"3\"}",
                                    success: function (data) {
                                        //alert(data);
                                        var returnData = [];
                                        data = JSON.parse(data);
                                        for (var i = 0; i < data.length; i++) {
                                            returnData.push(data[i].standard_effect);
                                        }

                                        //alert(JSON.stringify(returnData));
                                        //response(returnData);
                                        response($.ui.autocomplete.filter(returnData, request.term));
                                        $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                        $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                                    },
                                    error: function (xhr) {
                                        //alert(JSON.stringify(xhr));
                                    }
                                });
                            },
                            select: function (event, ui) {
                                $(this).val(ui.item.label);
                                $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                                $(this).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                            }
                        });
                    });
                };
                this.addRow = function (singleSelect) {
                    var self = this;
                    switch (self.effectinputArray[singleSelect].length) {
                        case 0:
                            self.effectinputArray[singleSelect].push({ id: this.ccounter, effect: '', weight: '1.0' });
                            self.ccounter++;
                            break;
                        case 1:
                            self.effectinputArray[singleSelect][0].weight = '0.7';
                            self.effectinputArray[singleSelect].push({ id: this.ccounter, effect: '', weight: '0.3' });
                            self.ccounter++;
                            break;
                        case 2:
                            self.effectinputArray[singleSelect][0].weight = '0.6';
                            self.effectinputArray[singleSelect][1].weight = '0.3';
                            self.effectinputArray[singleSelect].push({ id: this.ccounter, effect: '', weight: '0.1' });
                            self.ccounter++;
                            break;
                        default:
                            alert('最多三種功效');
                            break;
                    }
                };
                this.selectmedicine = function (singleSelect, index) {
                    var self = this;

                    //alert(singleSelect);
                    /*self.http.post("searchMedicineAPI.do", {
                    action: "getSingleMedicineEffects",
                    Med: self.pickMedicineResult[index].name
                    }).success(function (response) {*/
                    var effects = "";
                    for (var i = 0; i < self.effectinputArray[singleSelect].length; i++) {
                        effects = effects + "。" + self.effectinputArray[singleSelect][i].effect;
                    }
                    effects = effects.substring(1);
                    self.selectMedicineResult[singleSelect - 1].push({ name: self.pickMedicineResult[index].name, score: self.pickMedicineResult[index].score, effect: effects });
                    self.pickMedicineResult.splice(index, 1);

                    //console.debug(self.selectMedicineResult);
                    var names = "";
                    for (var j = 0; j < 4; j++) {
                        for (var i = 0; i < self.selectMedicineResult[j].length; i++) {
                            names = names + "。" + self.selectMedicineResult[j][i].name;
                        }
                    }
                    self.http.post("searchMedicineAPI.do", {
                        action: "findPrescription",
                        medData: names.substring(1)
                    }).success(function (response) {
                        if (response != "") {
                            self.fongji = "方劑：" + response;
                        } else {
                            self.fongji = "";
                        }
                    });
                    /*});*/
                };
                this.printDiv = function (divName) {
                    $("input[type=text]").each(function () {
                        $("<div>" + $(this).val() + "</div>").insertBefore($(this));
                        $(this).hide();
                    });

                    var printContents = document.getElementById(divName).innerHTML;
                    var w = window.open();
                    w.document.write(printContents);
                    w.print();
                    w.close();

                    $("input[type=text]").each(function () {
                        $(this).prev("div").remove();
                        $(this).show();
                    });
                };
                this.delSelectMedicineRow = function (type, index) {
                    var self = this;
                    self.selectMedicineResult[type].splice(index, 1);
                    self.pickmedicine(type + 1);
                };
                this.delRow = function (singleSelect, index) {
                    var self = this;
                    switch (self.effectinputArray[singleSelect].length) {
                        case 0:
                            break;
                        case 1:
                            //self.effectinputArray[singleSelect].splice(index, 1);
                            alert('無法刪除最後一個功效。');
                            break;
                        case 2:
                            self.effectinputArray[singleSelect].splice(index, 1);
                            self.effectinputArray[singleSelect][0].weight = '1.0';
                            break;
                        case 3:
                            self.effectinputArray[singleSelect].splice(index, 1);
                            self.effectinputArray[singleSelect][0].weight = '0.7';
                            self.effectinputArray[singleSelect][1].weight = '0.3';
                        default:
                            break;
                    }
                    //alert(self.effectinputArray[index].effect);
                    //var item = self.effectinputArray.indexOf(index);
                    //self.effectinputArray.splice(item, 1);
                };
                this.pickmedicine = function (singleSelect) {
                    var self = this;
                    var effectArray = ["", "", ""];
                    for (var i = 0; i < self.effectinputArray[singleSelect].length; i++) {
                        if (self.effectinputArray[singleSelect][i].effect.length == 0) {
                            alert('功效' + (i + 1) + '尚未輸入！');
                            return;
                        } else {
                            effectArray[i] = $("#effectinput" + self.effectinputArray[singleSelect][i].id).val(); //self.effectinputArray[singleSelect][i].effect;
                        }
                    }

                    //console.debug(effectArray);
                    self.http.post("searchMedicineAPI.do", {
                        action: "pickmedicine",
                        effectone: effectArray[0],
                        effecttwo: effectArray[1],
                        effectthree: effectArray[2]
                    }).success(function (response) {
                        for (var j = 0; j < 4; j++) {
                            for (var i = 0; i < self.selectMedicineResult[j].length; i++) {
                                var delindex = -1;
                                for (var k = 0; k < response.length; k++) {
                                    if (response[k].name == self.selectMedicineResult[j][i].name) {
                                        delindex = k;
                                    }
                                }
                                if (delindex != -1) {
                                    response.splice(delindex, 1);
                                }
                            }
                        }
                        self.pickMedicineResult = response;
                    });
                };
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;
                this.modal = $modal;
                var self = this;

                this.tabs = [
                    { title: "單一功效配伍查詢", template: "searchMedicine/SelectMedicine.jsp" }
                ];
                self.get_original_effect();
                self.get_original_effect2();
                self.get_standard_effect_select();
                self.get_medicine_class();

                // self.get_medicine_original_name_search();
                self.View = 0;
                self.SearchView = 0;
                self.NOTPrescrption = 0;
                self.progressbar = false;

                this.a = [];
                this.b = [];
                this.c = [];
                this.cp = [];
                this.d = [];
                this.aEffect = [];
                this.bEffect = [];
                this.cEffect = [];
                this.dEffect = [];
                this.POISONArray = [];
                this.opti = [];
                this.blocks = [];

                this.effectinputArray = [
                    [],
                    [{ id: 1, effect: '', weight: '1.0' }],
                    [{ id: 1, effect: '', weight: '1.0' }],
                    [{ id: 1, effect: '', weight: '1.0' }],
                    [{ id: 1, effect: '', weight: '1.0' }]]; //'<a href="#">ad</a>', '<a href="#">ad2</a>'];
                this.ccounter = 3;
                this.pickMedicineResult = [];
                this.selectMedicineResult = [[], [], [], []];
            }
            MedicineController_old.prototype.get_original_effect3 = function () {
                var self = this;

                self.http.post("searchMedicine_old.do", { action: "get_original_effect" }).success(function (response) {
                    self.OriginalEffect = response;
                    self.log.log("OriginalEffect: " + self.OriginalEffect);
                });
            };

            MedicineController_old.prototype.get_original_effect = function () {
                var self = this;

                self.http.post("searchMedicine_old.do", { action: "get_original_effect" }).success(function (response) {
                    self.OriginalEffect = response;
                    self.log.log("OriginalEffect: " + self.OriginalEffect);
                });
            };
            MedicineController_old.prototype.get_original_effect2 = function () {
                var self = this;

                self.http.post("searchMedicine_old.do", { action: "get_original_effect2" }).success(function (response) {
                    self.OriginalEffect2 = response;
                    self.log.log("OriginalEffect2: " + self.OriginalEffect2);
                });
            };

            MedicineController_old.prototype.get_standard_effect_select = function () {
                var self = this;

                self.http.post("searchMedicine_old.do", { action: "get_standard_effect_select" }).success(function (response) {
                    self.StandardEffectSelect = response;
                    self.log.log("StandardEffectSelect: " + self.StandardEffectSelect);
                });
            };

            MedicineController_old.prototype.get_medicine_class = function () {
                var self = this;

                self.http.post("searchMedicine_old.do", { action: "get_medicine_class" }).success(function (response) {
                    self.MedicineClass = response;
                });
            };

            /*   public get_medicine_original_name_search() {
            var self = this;
            
            self.http.post("searchMedicine.do", { action: "get_medicine_original_name" }
            ).success(function(response: any) {
            self.OriginalmedName = response;
            });
            }*/
            MedicineController_old.prototype.get_medicine_classMed = function (classMed) {
                var self = this;

                self.http.post("searchMedicine_old.do", {
                    action: "get_medicine_classMed", classMed: classMed
                }).success(function (response) {
                    self.MedicineClassMed = response;
                });
            };

            MedicineController_old.prototype.get_SingleMedicine = function () {
                var self = this;

                self.http.post("searchMedicine_old.do", {
                    action: "get_SingleMedicine", Med: self.second_class
                }).success(function (response) {
                    self.MedInfo = response;
                    if (self.MedInfo.length != 0) {
                        self.View = 1;
                        self.second_class2 = self.MedInfo[0].med;
                    } else {
                        self.View = 0;
                    }
                });
            };

            MedicineController_old.prototype.addStandardEffect = function (original_effect) {
                var self = this;
                self.log.log("original_effect: " + original_effect);

                self.http.post("searchMedicine_old.do", {
                    action: "get_standard_effect", originalEffect: original_effect
                }).success(function (response) {
                    self.StandardEffect = response;
                    self.log.log("StandardEffect: " + self.StandardEffect);
                });
            };

            MedicineController_old.prototype.Search_Standard_MedName = function () {
                var self = this;
                if (self.StrOriginalMedName == "") {
                    self.StrStandardMedName = "";
                } else {
                    self.http.post("searchMedicine_old.do", {
                        action: "get_standard_MedName", OriginalMedName: self.StrOriginalMedName
                    }).success(function (response) {
                        self.StrStandardMedName = response;
                    });
                }
            };

            MedicineController_old.prototype.Search_Original_MedName = function () {
                var self = this;
                if (self.StrStandardMedName == "") {
                    self.StrOriginalMedName = "";
                } else {
                    self.http.post("searchMedicine_old.do", {
                        action: "get_original_MedName", StandardMedName: self.StrStandardMedName
                    }).success(function (response) {
                        self.StrOriginalMedName = response;
                    });
                }
            };

            //  public effectCombination() {  //標準功效查詢: 標準功效雙擊效果
            //       var self = this;
            //      var showinputeffect = $("#showinputeffect").val();
            //      var standard_effect = $("#standard_effect").val();
            //
            //      if (showinputeffect.indexOf("。") > -1 && showinputeffect.indexOf(standard_effect) == -1 && standard_effect.localeCompare(null) != 0) {
            //          $("#showinputeffect").val(showinputeffect + standard_effect + "。");
            //      } else if (showinputeffect.indexOf("。") == -1 && standard_effect.localeCompare(null) != 0) {
            //          $("#showinputeffect").val(standard_effect + "。");
            //      } /*else if (test.indexOf(txt) > -1) {
            //			$("#showinputeffect").html(test.replace(txt + "。", ""));
            //		}*/
            //  }
            MedicineController_old.prototype.clear_showinputeffect = function () {
                var self = this;
                $("#showinputeffect").val("");
            };

            MedicineController_old.prototype.searchMedicine = function () {
                var self = this;
                var showinputeffect = $("#showinputeffect").val();
                self.log.log(showinputeffect);

                self.http.post("searchMedicine_old.do", {
                    action: "searchMedicine_old", standard_effect: showinputeffect
                }).success(function (response) {
                    if (response.length != 0) {
                        self.SearchMedInfo = response;
                        self.SearchView = 1;
                        $("#showMedicine").html("");
                    } else {
                        $("#showMedicine").html("查無此藥材");
                        self.SearchView = 0;
                    }
                });
            };

            MedicineController_old.prototype.Pawo = function () {
                var self = this;
                var effectone = $("#effectone").val();
                var effecttwo = $("#effecttwo").val();
                var effectthree = $("#effectthree").val();
                var effectfour = $("#effectfour").val();
                self.log.log(effectone);
                self.log.log(effecttwo);
                self.log.log(effectthree);
                self.log.log(effectfour);
                self.progressbar = true;
                $("#myBar").width('0%');
                self.width = 1;
                var id = setInterval(frame, 10);
                function frame() {
                    if (self.width >= 100) {
                        clearInterval(id);
                    } else {
                        self.width++;

                        if (self.width < 100) {
                            $("#myBar").width(self.width + '%');
                            $("#myBar").html(Math.floor(self.width / 3) + '%');
                        } else {
                            $("#myBar").width(self.width + '%');
                            $("#myBar").html(self.width + '%');
                        }
                    }
                }

                self.a = [];
                self.b = [];
                self.c = [];
                self.d = [];
                self.aEffect = [];
                self.bEffect = [];
                self.cEffect = [];
                self.dEffect = [];
                self.POISONArray = [];

                self.http.post("searchMedicine_old.do", {
                    action: "pawo",
                    effectone: effectone,
                    effecttwo: effecttwo,
                    effectthree: effectthree,
                    effectfour: effectfour,
                    key: 0
                }).success(function (response) {
                    // self.pawo = response;
                    self.opti = response;
                    self.progressbar = false;
                    self.log.log("self.opti[0].ooo.length: " + self.opti[0].one.length);

                    //  self.log.log("self.opti[1].ooo.length: " + self.opti[1].ooo.length);
                    self.log.log("self.opti.length: " + self.opti.length);

                    self.PresctirtionName = self.opti[0].PresctirtionName;

                    if (self.opti[0].one.length != 0) {
                        self.NOTPrescrption = 0;
                        for (var i = 0; i < self.opti.length; i++) {
                            if (self.opti[i].one.length != 0) {
                                self.a[i] = self.opti[i].one[0];
                                self.aEffect[i] = self.opti[i].oo[0];
                            }
                            if (self.opti[i].two.length != 0) {
                                self.b[i] = self.opti[i].two[0];
                                self.bEffect[i] = self.opti[i].tt[0];
                            }
                            if (self.opti[i].three.length != 0) {
                                self.c[i] = self.opti[i].three[0];
                                self.cEffect[i] = self.opti[i].rr[0];
                            }
                            if (self.opti[i].four.length != 0) {
                                self.d[i] = self.opti[i].four[0];
                                self.dEffect[i] = self.opti[i].ff[0];
                            }
                        }
                    } else {
                        self.NOTPrescrption = 1;
                    }
                    self.log.log("self.opti[0].threePOSION: " + self.opti[0].threePOSION);
                    for (var i = 0; i < self.cp.length; i++) {
                        self.cp[i] = "";
                    }
                });
            };

            MedicineController_old.prototype.DisplayEffect = function (index, num, med) {
                var self = this;
                self.log.log("index num med: " + index + "~~" + num + "~~" + med);

                self.progressbar = true;
                $("#myBar").width('0%');
                self.width = 1;
                var id = setInterval(frame, 10);
                function frame() {
                    if (self.width >= 100) {
                        clearInterval(id);
                    } else {
                        self.width++;
                        $("#myBar").width(self.width + '%');
                        if (self.width < 95) {
                            $("#myBar").html(Math.floor(self.width / 3) + '%');
                        } else {
                            $("#myBar").html(self.width + '%');
                        }
                    }
                }

                var effectone = $("#effectone").val();
                var effecttwo = $("#effecttwo").val();
                var effectthree = $("#effectthree").val();
                var effectfour = $("#effectfour").val();

                if (num == 1) {
                    var medData = "";
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.a[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].one.length; i++) {
                        if (self.opti[index].one[i] == med) {
                            self.aEffect[index] = self.opti[index].oo[i];
                        }
                    }

                    self.http.post("searchMedicine_old.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        key: 1
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].one.length != 0) {
                                    self.a[i] = self.opti[i].one[0];
                                    self.aEffect[i] = self.opti[i].oo[0];
                                }
                            }
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].two.length != 0) {
                                    self.b[j] = self.opti[j].two[0];
                                    self.bEffect[j] = self.opti[j].tt[0];
                                }
                                if (self.opti[j].three.length != 0) {
                                    self.c[j] = self.opti[j].three[0];
                                    self.cEffect[j] = self.opti[j].rr[0];
                                }
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 2) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.b[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].two.length; i++) {
                        if (self.opti[index].two[i] == med) {
                            self.bEffect[index] = self.opti[index].tt[i];
                        }
                    }

                    self.http.post("searchMedicine_old.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        key: 1
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].two.length != 0) {
                                    self.b[i] = self.opti[i].two[0];
                                    self.bEffect[i] = self.opti[i].tt[0];
                                }
                            }
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].three.length != 0) {
                                    self.c[j] = self.opti[j].three[0];
                                    self.cEffect[j] = self.opti[j].rr[0];
                                }
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 3) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < self.b.length; i++) {
                        medData += self.b[i] + "。";
                    }
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.c[i] + "。";
                    }
                    var POSION = "";
                    for (var i = 0; i < self.cp.length; i++) {
                        POSION += self.cp[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].three.length; i++) {
                        if (self.opti[index].three[i] == med) {
                            self.cEffect[index] = self.opti[index].rr[i];
                        }
                    }

                    self.http.post("searchMedicine_old.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        POSION: POSION,
                        key: 2
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].three.length != 0) {
                                    self.c[i] = self.opti[i].three[0];
                                    self.cEffect[i] = self.opti[i].rr[0];
                                }
                            }
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 4) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < self.b.length; i++) {
                        medData += self.b[i] + "。";
                    }
                    for (var i = 0; i < self.c.length; i++) {
                        medData += self.c[i] + "。";
                    }
                    for (var i = 0; i < index + 1; i++) {
                        medData += self.d[i] + "。";
                    }
                    var POSION = "";
                    for (var i = 0; i < self.cp.length; i++) {
                        POSION += self.cp[i] + "。";
                    }

                    for (var i = 0; i < self.opti[index].four.length; i++) {
                        if (self.opti[index].four[i] == med) {
                            self.dEffect[index] = self.opti[index].ff[i];
                        }
                    }

                    self.http.post("searchMedicine_old.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        POSION: POSION,
                        key: 2
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var i = index + 1; i < self.opti.length; i++) {
                                if (self.opti[i].four.length != 0) {
                                    self.d[i] = self.opti[i].four[0];
                                    self.dEffect[i] = self.opti[i].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                } else if (num == 5) {
                    var medData = "";
                    for (var i = 0; i < self.a.length; i++) {
                        medData += self.a[i] + "。";
                    }
                    for (var i = 0; i < self.b.length; i++) {
                        medData += self.b[i] + "。";
                    }
                    var POSION = "";
                    for (var i = 0; i < self.cp.length; i++) {
                        POSION += self.cp[i] + "。";
                    }
                    self.log.log("POSION: " + POSION);

                    self.http.post("searchMedicine_old.do", {
                        action: "pawo",
                        effectone: effectone,
                        effecttwo: effecttwo,
                        effectthree: effectthree,
                        effectfour: effectfour,
                        medData: medData,
                        POSION: POSION,
                        key: 2
                    }).success(function (response) {
                        self.opti = response;
                        self.progressbar = false;
                        self.PresctirtionName = self.opti[0].PresctirtionName;

                        if (self.opti[0].one.length != 0) {
                            self.NOTPrescrption = 0;
                            for (var j = 0; j < self.opti.length; j++) {
                                if (self.opti[j].three.length != 0) {
                                    self.c[j] = self.opti[j].three[0];
                                    self.cEffect[j] = self.opti[j].rr[0];
                                }
                                if (self.opti[j].four.length != 0) {
                                    self.d[j] = self.opti[j].four[0];
                                    self.dEffect[j] = self.opti[j].ff[0];
                                }
                            }
                        } else {
                            self.NOTPrescrption = 1;
                        }
                    });
                }

                if (num < 3) {
                    for (var i = 0; i < self.cp.length; i++) {
                        self.cp[i] = "";
                    }
                }
            };

            //----------------------------------------------------------------------------------------------------------------//
            MedicineController_old.prototype.open = function (num) {
                var self = this;
                var modalInstance = self.modal.open({
                    templateUrl: 'searchMedicine/standardeffect_model.jsp',
                    controller: 'tcm.Medicine.ModalstandardeffectController',
                    resolve: {
                        num: function () {
                            return num;
                        }
                    }
                });
                modalInstance.result.then(function () {
                });
            };
            return MedicineController_old;
        })();
        Medicine_old.MedicineController_old = MedicineController_old;

        var ModalstandardeffectController = (function () {
            function ModalstandardeffectController($scope, $modalInstance, $http, $log, $modal, num) {
                this.standardeffect_model = [];
                this.cancel = function () {
                    this.modalInstance.dismiss('cancel');
                };
                var self = this;
                self.scope = $scope;
                self.scope.viewModel = this;
                self.modalInstance = $modalInstance;
                self.http = $http;
                self.log = $log;
                self.modal = $modal;
                self.nums = num;

                if (self.nums == "1") {
                    self.effectone = $("#effectone").val(); //JQuery
                } else if (self.nums == "2") {
                    self.effectone = $("#effecttwo").val();
                } else if (self.nums == "3") {
                    self.effectone = $("#effectthree").val();
                } else if (self.nums == "4") {
                    self.effectone = $("#effectfour").val();
                } else if (self.nums == "5") {
                    self.effectone = $("#showinputeffect").val();
                }

                //window["tcm_context_path"] + "/searchMedicine.do"
                self.http.post("searchMedicine_old.do", {
                    action: "get_standard_effectALL",
                    num: self.nums
                }).success(function (response, status) {
                    self.standardeffect_model = response;
                    self.log.log("standardeffect_model: " + self.standardeffect_model);
                });
            }
            ModalstandardeffectController.prototype.addStandardEffect_model = function (effect) {
                var self = this;

                if (self.effectone.indexOf("。") > -1 && self.effectone.indexOf(effect) == -1) {
                    self.effectone = self.effectone + effect + "。";
                    self.log.log("1");
                } else if (self.effectone.indexOf("。") == -1) {
                    self.effectone = effect + "。";
                    self.log.log("2");
                } else if (self.effectone.indexOf(effect) > -1) {
                    self.effectone = self.effectone.replace(effect + "。", "");
                    self.log.log("3");
                }
            };

            ModalstandardeffectController.prototype.enter_model = function (effect_al) {
                var self = this;

                if (self.nums == "1") {
                    $("#effectone").val(effect_al);
                } else if (self.nums == "2") {
                    $("#effecttwo").val(effect_al);
                } else if (self.nums == "3") {
                    $("#effectthree").val(effect_al);
                } else if (self.nums == "4") {
                    $("#effectfour").val(effect_al);
                } else if (self.nums == "5") {
                    $("#showinputeffect").val(effect_al);
                }

                self.modalInstance.dismiss('cancel');
            };
            ModalstandardeffectController.prototype.clear_model = function () {
                var self = this;
                self.effectone = "";
            };
            return ModalstandardeffectController;
        })();
        Medicine_old.ModalstandardeffectController = ModalstandardeffectController;
    })(tcm.Medicine_old || (tcm.Medicine_old = {}));
    var Medicine_old = tcm.Medicine_old;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    /// <reference path='../../../typings/jquery/jquery.d.ts'/>
    /// <reference path='../../../typings/angularjs/angular.d.ts'/>
    /// <reference path='../../../typings/ngtable/ng-table.d.ts'/>
    (function (EffectMaintain) {
        

        

        var EffectMaintainController = (function () {
            function EffectMaintainController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                $scope.viewModel = this;
                this.http = $http;
                this.log = $log;

                //增加
                //this.UnConfirmList = [];
                //this.SymptomsMappingList = [];
                this.EffectMappingList = [];

                this.NameMappingList = [];

                //增加
                this.modal = $modal;
                var self = this;

                this.tabs = [
                    { title: "藥材功效別名維護", template: "searchMedicine/MedicineEffectMaintain.jsp" },
                    { title: "藥材別名維護", template: "searchMedicine/MedicineNameMaintain.jsp" }
                ];

                $scope.$watch("viewModel", function () {
                    return self.get_effect_class();
                });
                $scope.$watch("viewModel", function () {
                    return self.clean();
                });

                $scope.$watch("viewModel", function () {
                    return self.get_name_class();
                });
                $scope.$watch("viewModel", function () {
                    return self.clean_name();
                });

                //self.get_effect_class();
                //self.clean();//增加
                // self.get_medicine_original_name_search();
                //新增
                self.EffectMappingtableParams = new ngTableParams({
                    action: "FatchEffectMappingData",
                    table: "MappingData",
                    page: 1,
                    count: 10
                }, {
                    total: self.EffectMappingList.length,
                    getData: function ($defer, params) {
                        self.http.post("EffectMaintain.do", params.url()).success(function (response, status) {
                            self.EffectMappingList = response.data;
                            params.total(response.length); //ngtable要求資料量計算幾個頁數
                            self.AllEffectMappingData = response; //顯示全部資料
                            $defer.resolve(response.data); //ngtable顯示頁面的資料
                        });
                    }
                });

                //新增
                self.NameMappingtableParams = new ngTableParams({
                    action: "FatchNameMappingData",
                    table: "MappingData",
                    page: 1,
                    count: 10
                }, {
                    total: self.NameMappingList.length,
                    getData: function ($defer, params) {
                        self.http.post("EffectMaintain.do", params.url()).success(function (response, status) {
                            self.NameMappingList = response.data;
                            params.total(response.length); //ngtable要求資料量計算幾個頁數
                            self.AllNameMappingData = response; //顯示全部資料
                            $defer.resolve(response.data); //ngtable顯示頁面的資料
                        });
                    }
                });
            }
            //增加
            EffectMaintainController.prototype.clean = function () {
                var self = this;
                self.effect_maintain_original_text = "";
                self.effect_maintain_standard_text = "";
                /*self.name_maintain_original_text = "";*/
                /*self.name_maintain_standard_text = "";*/
            };

            //增加
            EffectMaintainController.prototype.effectMappingChecked = function (item) {
                var self = this;
                self.effect_maintain_original_text = item.original_symptoms;
                self.effect_maintain_standard_text = item.standard_symptoms; //我把句號拿掉
                $("html, body").animate({ scrollTop: 0 }, "slow");
            };

            //新增
            EffectMaintainController.prototype.addEffect = function (item) {
                var self = this;

                var standard_effect = self.effect_maintain_standard_text;

                //standard_sym = jQuery.trim(standard_sym);
                //var sym_split = standard_sym.split("。");
                /*
                jQuery.each(sym_split, function(i, val) {
                if (val == item) {
                return (has_sym = true);
                }
                });*/
                standard_effect = standard_effect + item; //我把句號拿掉
                self.effect_maintain_standard_text = standard_effect;
            };

            //新增
            EffectMaintainController.prototype.reset = function () {
                var self = this;
                self.effect_maintain_original_text = "";
                self.effect_maintain_standard_text = "";
            };

            //新增
            EffectMaintainController.prototype.addNewEffectMapping = function () {
                var self = this;
                var original_text = self.effect_maintain_original_text;

                //original_text = jQuery.trim(original_text).replace(/[\r\n]/g, "");
                var standard_text = self.effect_maintain_standard_text;

                //standard_text = jQuery.trim(standard_text).replace(/[\r\n]/g, "");
                //var OriginalSize = original_text.split("[.;。]");
                var OriginalSize = 1;

                var checked_id = $("input[name='effectMappingsCheckbox']:checked").attr("id");

                if (original_text.length > 0 && standard_text.length > 0) {
                    if (OriginalSize > 1) {
                        alert("原始症狀只能輸入一個。");
                    } else if (confirm("確定要新增嗎?")) {
                        self.http.post("EffectMaintain.do", { original_text: original_text, standard_text: standard_text, checked_id: checked_id, action: "addNewEffectMapping" }).success(function (response, status) {
                            if (response.type == "delete") {
                                if (response.conflict) {
                                    alert("新增對應衝突『" + response.conflict + "』");
                                } else {
                                    alert("新增成功。");
                                }
                                self.reset();
                            } else if (response.type == "modify") {
                                /*
                                if (response.standard_symptoms) {
                                alert("新增對應成功『" + response.standard_symptoms + "』標準症狀。");
                                }*/
                                if (response.not_standard_symptoms) {
                                    alert("對應失敗，無『" + response.not_standard_symptoms + "』標準功效，請確認藥材功效。");
                                }

                                self.effect_maintain_standard_text = response.standard_symptoms;
                                /*
                                for (var i in self.UnConfirmList) {
                                if (self.UnConfirmList[i].id == Number(checked_id)) {
                                self.UnConfirmList[i].standard_symptoms = response.standard_symptoms;
                                }
                                }*/
                            }
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                } else {
                    alert("請輸入原始症狀和標準症狀。");
                }
            };

            //新增
            EffectMaintainController.prototype.DeleteEffectMappingDatabase = function () {
                var self = this;
                var same = false;
                var checked_id = $("input[name='effectMappingsCheckbox']:checked").attr("id");
                var original_text = self.effect_maintain_original_text;
                var standard_text = self.effect_maintain_standard_text;

                for (var i in self.EffectMappingList) {
                    if (self.EffectMappingList[i].id == Number(checked_id)) {
                        if (self.EffectMappingList[i].original_symptoms == original_text && self.EffectMappingList[i].standard_symptoms == standard_text) {
                            same = true;
                        }
                    }
                }

                if (same) {
                    if (confirm("確定要刪除嗎?\n(此為刪除已定義症狀。)\n")) {
                        self.http.post("EffectMaintain.do", { checked_id: checked_id, action: "DeleteEffectMappingData" }).success(function (response, status) {
                            if (response == "success") {
                                for (var i in self.EffectMappingList) {
                                    if (self.EffectMappingList[i].id == Number(checked_id)) {
                                        self.EffectMappingList.splice(i, 1);
                                    }
                                }
                                alert("刪除成功");
                                self.reset();
                            } else {
                                alert("資料庫發生錯誤。");
                            }
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                } else {
                    alert("請由下方的表格點選要刪除的資料並且要一致。");
                }
            };

            //新增
            EffectMaintainController.prototype.get_effect_class = function () {
                var self = this;

                self.http.post("EffectMaintain.do", { action: "get_effect_class" }).success(function (response) {
                    self.EffectClass = response;
                });
            };

            //新增
            EffectMaintainController.prototype.get_effect_classEffect = function (classMed) {
                var self = this;

                self.http.post("EffectMaintain.do", {
                    action: "get_effect_classEffect", classMed: classMed
                }).success(function (response) {
                    self.EffectClassInd = response;
                });
            };

            //增加
            EffectMaintainController.prototype.clean_name = function () {
                var self = this;

                self.name_maintain_original_text = "";
                self.name_maintain_standard_text = "";
            };

            //新增
            EffectMaintainController.prototype.reset_name_text = function () {
                var self = this;
                self.name_maintain_original_text = "";
                self.name_maintain_standard_text = "";
            };

            //增加
            EffectMaintainController.prototype.nameMappingChecked = function (item) {
                var self = this;
                self.name_maintain_standard_text = item.standard_symptoms;
                self.name_maintain_original_text = item.original_symptoms; //我把句號拿掉
                $("html, body").animate({ scrollTop: 0 }, "slow");
            };

            //新增
            EffectMaintainController.prototype.addName = function (item) {
                var self = this;

                var standard_effect = self.name_maintain_standard_text;

                //standard_sym = jQuery.trim(standard_sym);
                //var sym_split = standard_sym.split("。");
                /*
                jQuery.each(sym_split, function(i, val) {
                if (val == item) {
                return (has_sym = true);
                }
                });*/
                standard_effect = standard_effect + item; //我把句號拿掉
                self.name_maintain_standard_text = standard_effect;
            };

            //新增
            EffectMaintainController.prototype.addNewNameMapping = function () {
                var self = this;
                var original_text = self.name_maintain_original_text;

                //original_text = jQuery.trim(original_text).replace(/[\r\n]/g, "");
                var standard_text = self.name_maintain_standard_text;

                //standard_text = jQuery.trim(standard_text).replace(/[\r\n]/g, "");
                //var OriginalSize = original_text.split("[.;。]");
                var OriginalSize = 1;

                var checked_id = $("input[name='NameMappingsCheckbox']:checked").attr("id");

                if (original_text.length > 0 && standard_text.length > 0) {
                    if (OriginalSize > 1) {
                        alert("原始症狀只能輸入一個。");
                    } else if (confirm("確定要新增嗎?")) {
                        self.http.post("EffectMaintain.do", { original_text: original_text, standard_text: standard_text, checked_id: checked_id, action: "addNewNameMapping" }).success(function (response, status) {
                            if (response.type == "delete") {
                                if (response.conflict) {
                                    alert("新增對應衝突『" + response.conflict + "』");
                                } else {
                                    alert("新增成功。");
                                }
                                self.reset_name_text();
                            } else if (response.type == "modify") {
                                /*
                                if (response.standard_symptoms) {
                                alert("新增對應成功『" + response.standard_symptoms + "』標準症狀。");
                                }*/
                                if (response.not_standard_symptoms) {
                                    alert("對應失敗，無『" + response.not_standard_symptoms + "』標準藥材，請確認標準藥材名稱。");
                                }

                                //self.name_maintain_standard_text = response.standard_symptoms;
                                self.name_maintain_standard_text = "";
                                /*
                                for (var i in self.UnConfirmList) {
                                if (self.UnConfirmList[i].id == Number(checked_id)) {
                                self.UnConfirmList[i].standard_symptoms = response.standard_symptoms;
                                }
                                }*/
                            }
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                } else {
                    alert("請輸入原始症狀和標準症狀。");
                }
            };

            //新增
            EffectMaintainController.prototype.DeleteNameMappingDatabase = function () {
                var self = this;
                var same = false;
                var checked_id = $("input[name='NameMappingsCheckbox']:checked").attr("id");
                var original_text = self.name_maintain_original_text;
                var standard_text = self.name_maintain_standard_text;

                for (var i in self.NameMappingList) {
                    if (self.NameMappingList[i].id == Number(checked_id)) {
                        if (self.NameMappingList[i].original_symptoms == original_text && self.NameMappingList[i].standard_symptoms == standard_text) {
                            same = true;
                        }
                    }
                }

                if (same) {
                    if (confirm("確定要刪除嗎?\n(此為刪除已定義症狀。)\n")) {
                        self.http.post("EffectMaintain.do", { checked_id: checked_id, action: "DeleteNameMappingData" }).success(function (response, status) {
                            if (response == "success") {
                                for (var i in self.NameMappingList) {
                                    if (self.NameMappingList[i].id == Number(checked_id)) {
                                        self.NameMappingList.splice(i, 1);
                                    }
                                }
                                alert("刪除成功");
                                self.reset_name_text();
                            } else {
                                alert("資料庫發生錯誤。");
                            }
                        }).error(function (response) {
                            self.log.log(response);
                        });
                    }
                } else {
                    alert("請由下方的表格點選要刪除的資料並且要一致。");
                }
            };

            //新增
            EffectMaintainController.prototype.get_name_class = function () {
                var self = this;

                self.http.post("EffectMaintain.do", { action: "get_name_class" }).success(function (response) {
                    self.NameClass = response;
                });
            };

            //新增
            EffectMaintainController.prototype.get_name_className = function (classMed) {
                var self = this;

                self.http.post("EffectMaintain.do", {
                    action: "get_name_className", classMed: classMed
                }).success(function (response) {
                    self.NameClassInd = response;
                });
            };
            return EffectMaintainController;
        })();
        EffectMaintain.EffectMaintainController = EffectMaintainController;
    })(tcm.EffectMaintain || (tcm.EffectMaintain = {}));
    var EffectMaintain = tcm.EffectMaintain;
})(tcm || (tcm = {}));
var tcm;
(function (tcm) {
    (function (Fourdiagnostic) {
        var FourdiagnosticController = (function () {
            function FourdiagnosticController($scope, $http, $location, $log, ngTableParams, $filter, $modal) {
                $scope.viewModel = this;
                var self = this;
                this.http = $http;
                this.log = $log;

                self.List = [];
                self.keyword_model = "";

                //  self.checked = false;
                this.tabs = [
                    { title: "望診症狀", template: "Observation.jsp" },
                    { title: "聞疹症狀", template: "Smelling.jsp" },
                    { title: "問診症狀", template: "Inquiry.jsp" },
                    { title: "切疹症狀", template: "Palpation.jsp" }
                ];
                self.addacount01();
                self.addacount02();
                self.addacount03();
            }
            //列出症狀
            FourdiagnosticController.prototype.addacount01 = function () {
                var self = this;
                self.http.post("Fourdiagnostic.do", {
                    action: "getaCount01"
                }).success(function (response) {
                    self.log.log("Name" + response);
                    self.Name = response;
                });
            };
            FourdiagnosticController.prototype.addacount02 = function () {
                var self = this;
                self.http.post("Fourdiagnostic.do", {
                    action: "getaCount02"
                }).success(function (response) {
                    self.log.log("Name02" + response);
                    self.Name02 = response;
                });
            };

            FourdiagnosticController.prototype.addacount03 = function () {
                var self = this;
                self.http.post("Fourdiagnostic.do", {
                    action: "getaCount03"
                }).success(function (response) {
                    self.log.log("Name03" + response);
                    self.Name03 = response;
                });
            };

            //勾選症狀
            FourdiagnosticController.prototype.addSymptoms = function (item) {
                var self = this;
                var symptoms = "";
                var flag = false;
                if (self.List.length > 0) {
                    for (var i in self.List) {
                        if (self.List[i] == item) {
                            flag = true;
                            if (flag == true) {
                                self.List.splice(i, 1);
                                break;
                            }
                        }
                    }
                }

                if (!flag) {
                    self.List.push(item);
                }
                for (var i in self.List) {
                    if (self.List[i] != "") {
                        symptoms += self.List[i] + "。";
                    }
                }

                self.keyword_model = symptoms;
            };

            FourdiagnosticController.prototype.CleanerSymptoms = function () {
                var self = this;
                self.keyword_model = "";
                for (var i in self.List) {
                    self.List[i] = "";
                }
                $('input[type=checkbox]').attr('checked', null);
                //原本是false 改成null 這樣typescript再編譯的時候才不會出現警告訊息
            };
            FourdiagnosticController.prototype.SaveSymptoms = function () {
                var self = this;

                self.http.post("Fourdiagnostic.do", {
                    action: "SaveSymptoms", data: self.keyword_model
                }).success(function (response, status) {
                });
            };
            return FourdiagnosticController;
        })();
        Fourdiagnostic.FourdiagnosticController = FourdiagnosticController;
    })(tcm.Fourdiagnostic || (tcm.Fourdiagnostic = {}));
    var Fourdiagnostic = tcm.Fourdiagnostic;
})(tcm || (tcm = {}));
